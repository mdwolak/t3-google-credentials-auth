export enum ErrorCode {
  UserNotFound = "user-not-found",
  IncorrectPassword = "incorrect-password",
  UserMissingPassword = "missing-password",
  InternalServerError = "internal-server-error",
  NewPasswordMatchesOld = "new-password-matches-old",
  ThirdPartyIdentityProviderEnabled = "third-party-identity-provider-enabled",
  RateLimitExceeded = "rate-limit-exceeded",
  SocialIdentityProviderRequired = "social-identity-provider-required",
}
