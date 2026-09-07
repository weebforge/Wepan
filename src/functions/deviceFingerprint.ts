import { Arg, ArgType, NativeFunction } from "@tryforge/forgescript";

import { getDeviceFingerprint } from "../util/fingerprint";

export default new NativeFunction({
  name: "$getDeviceFingerprint",
  aliases: ["$deviceFingerprint", "$fingerprint"],
  description: "Returns the device fingerprint.",
  version: "1.0.0",
  brackets: false,
  args: [
    Arg.optionalBoolean(
      "asString",
      "If true, returns the fingerprint as a string. Otherwise, returns it as a bigint.",
    ),
  ],
  unwrap: true,
  output: [ArgType.String, ArgType.BigInt],
  execute(ctx, [asString]) {
    const fingerprint = asString
      ? getDeviceFingerprint("string")
      : getDeviceFingerprint("bigint");
    return this.success(fingerprint);
  },
});
