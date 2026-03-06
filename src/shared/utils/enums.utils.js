//************** transaction enums ****************/
const transactionTypeEnums = {
  transfer: "TRANSFER",
  top_up: "TOP-UP",
  receive: "RECEIVE",
};

//************** user enums ****************/
const userRoleEnums = {
  super: "SUPER",
  admin: "ADMIN",
  client: "CLIENT",
};

const userThemeEnums = {
  dark: "DARK",
  light: "LIGHT",
};
const userLanguageEnums = {
  en: "FR",
  fr: "EN",
  ar: "AR",
};

//************** features enums ****************/

const FeaturesTypeEnum = {
  group: "group",
  collapsable: "collapsable",
  basic: "basic",
};

const featuresCodeEnum = {
  //features admins
  administration: "administration",
  setting_admin: "setting_admin",
  dashboard_admin: "dashboard_admin",
  features: "features",
  //users features
  accounts: "accounts",
  admins: "admins",
  clients: "clients",

  //features clients
  dashboard_client: "dashboard_client",
  setting_client: "setting_client",
  transactions : "transactions",
  cards_clients : "cards_client"
};

const featuresActionsEnum = {
  list: "list",
  create: "create",
  read: "read",
  update: "update",
  delete: "delete",
};

const featuresDestinationEnums = {
  admin: "ADMIN",
  client: "CLIENT",
};

export {
  transactionTypeEnums,
  userRoleEnums,
  FeaturesTypeEnum,
  featuresCodeEnum,
  featuresActionsEnum,
  featuresDestinationEnums,
  userLanguageEnums,
  userThemeEnums,
};
