import { $ } from "./functions/$";
import { Animate } from "./functions/animate";
import { DiscordCDN } from "./functions/discordCdn";
import { Fetchers } from "./fetch";
import { Store } from "./functions/store";
import { elementBuild } from "./functions/elementBuild";
import { loadElement } from "./functions/loadElement";
import { sleep } from "./functions/sleep";

/** Login */
async function login(): Promise<boolean> {
  let savedToken = Store.get("accessToken");

  // Try to login with token is already saved
  if (savedToken) {
    let hasAccess = await checkAccess(savedToken);
    if (hasAccess) {
      return true;
    } else {
      Store.remove("accessToken");
    }
  }

  // If no token is saved or the saved token is invalid, wire up the modal
  // so the user can log in on demand via the header button.
  let modalElement = $<"div">("#login-modal");

  if (!modalElement) {
    console.error("Login modal element not found in the DOM.");
    return false;
  }

  let loginBtnElement = $<"button">("#login-button");
  let closeBtnElement = $<"button">("#login-modal-close", modalElement);
  let cancelBtnElement = $<"button">("#login-modal-cancel", modalElement);
  let saveBtnElement = $<"button">("#login-modal-save", modalElement);
  let inputElement = $<"input">("#login-modal-input", modalElement);
  let errorElement = $<"p">("#login-modal-error", modalElement);

  if (
    !loginBtnElement ||
    !closeBtnElement ||
    !cancelBtnElement ||
    !saveBtnElement ||
    !inputElement ||
    !errorElement
  ) {
    console.error("Login modal elements not found in the DOM.");
    return false;
  }

  const openModal = () => {
    errorElement.classList.add("hidden");
    inputElement.value = "";
    modalElement.classList.remove("hidden");
    modalElement.classList.add("flex");
    inputElement.focus();
  };

  const closeModal = () => {
    modalElement.classList.add("hidden");
    modalElement.classList.remove("flex");
  };

  const showError = (message: string) => {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
    inputElement.focus();
  };

  const attemptLogin = async () => {
    const token = inputElement.value.trim();
    if (!token) {
      showError("Please enter a token.");
      return;
    }

    saveBtnElement.disabled = true;
    saveBtnElement.textContent = "Checking...";

    const hasAccess = await checkAccess(token);

    saveBtnElement.disabled = false;
    saveBtnElement.textContent = "Save";

    console.log("Access check result:", hasAccess, "for token:", token);

    if (!hasAccess) {
      showError("That token doesn't seem to be valid.");
      return;
    }

    Store.set("accessToken", token);
    closeModal();
    // Re-run the page's bootstrap now that we have a valid token.
    location.reload();
  };

  loginBtnElement.addEventListener("click", openModal);
  closeBtnElement.addEventListener("click", closeModal);
  cancelBtnElement.addEventListener("click", closeModal);
  saveBtnElement.addEventListener("click", attemptLogin);

  modalElement.addEventListener("click", (event) => {
    if (event.target === modalElement) closeModal();
  });
  inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") attemptLogin();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modalElement.classList.contains("hidden")) {
      closeModal();
    }
  });

  return false;
}

async function checkAccess(token: string): Promise<boolean> {
  try {
    let res = await Fetchers.Login(token);
    return res.permissions > 0;
  } catch (error) {
    return false;
  }
}

async function loadLoggedinUser() {
  let token = Store.get("accessToken");
  if (!token) return false;

  let hasAccess = await checkAccess(token);
  if (!hasAccess) {
    Store.remove("accessToken");
    location.reload();
    return false;
  }

  // Remove Login Button
  let loginBtnElement = $<"button">("#login-button");
  if (loginBtnElement) {
    loginBtnElement.remove();
  }

  // Load user info
  let userInfo = await Fetchers.Backend.User("@me");

  let userMenuElement = $<"div">("#user-menu");
  if (userMenuElement) {
    let avatarElement = $<"i">("#user-avatar", userMenuElement);
    let usernameElement = $<"span">("#user-username", userMenuElement);
    let userIdElement = $<"p">("#user-id", userMenuElement);
    let logoutBtnElement = $<"button">("#logout-button", userMenuElement);

    if (
      !userMenuElement ||
      !avatarElement ||
      !usernameElement ||
      !userIdElement ||
      !logoutBtnElement
    ) {
      console.error("User menu elements not found in the DOM.");
      return true;
    }
    userMenuElement.classList.remove("hidden");

    await sleep(1500); // sleep

    if (userInfo.avatar) {
      loadElement(avatarElement, (el) => {
        el.replaceWith(
          elementBuild("img", {
            id: "user-avatar",
            src: DiscordCDN.UserAvatar(userInfo.id, userInfo.avatar!, {}),
            alt: `@${userInfo.username}`,
            className: "h-9 w-9 rounded-full object-cover",
          }),
        );
      });
    }
    loadElement(usernameElement, (el) =>
      Animate.typing(el, `@${userInfo.username}`, { removeCursorOnEnd: true }),
    );
    loadElement(userIdElement, (el) =>
      Animate.typing(el, userInfo.id, { removeCursorOnEnd: true }),
    );

    logoutBtnElement.addEventListener("click", () => {
      Store.remove("accessToken");
      location.reload();
    });
  }

  return true;
}

export { login, loadLoggedinUser };
