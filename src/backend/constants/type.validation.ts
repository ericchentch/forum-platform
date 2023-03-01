export const EMAIL_REGEX =
  /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/g
export const PHONE_REGEX = /^(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})$/g
export const USERNAME_REGEX = /^[a-zA-Z0-9\\._\\-]{3,}$/g
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/g
