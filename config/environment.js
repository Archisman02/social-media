const development = {
  name: "development",
  asset_path: "./assets",
  session_cookie_key: "blahsomething",
  db: "codeial_development",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "archisman.mukherjee02",
      pass: "zyievtyrjbvicolq",
    },
  },
  google_client_id:
    "962502301026-t15rdg95q4j0hrea6k536cr2r1bm1366.apps.googleusercontent.com",
  google_client_secret: "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",
  google_call_back_url: "http://localhost:8000/users/auth/google/callback",
  jwt_secret: "codeial",
};

const production = {
  name: "production",
};

module.exports = development;
