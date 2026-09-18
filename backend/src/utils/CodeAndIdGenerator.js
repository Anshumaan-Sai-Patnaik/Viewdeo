import crypto from "crypto";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const characters_ =
  "abcdefghijklmnopqrstuvwxyz0123456789";

export const generateMeetingCode = () => {
  let code = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    code += characters[randomIndex];
  }

  return code;
};

export const generateGuestId = () => {
  let id = "";

  for (let i = 0; i < 25; i++) {
    const randomIndex = crypto.randomInt(0, characters_.length);
    id += characters_[randomIndex];
  }

  return id;
};