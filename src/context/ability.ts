import {
  AbilityTuple,
  defineAbility,
  MongoAbility,
  MongoQuery,
} from "@casl/ability";
import { IAddRule } from "~/interface/permission";

const ability: MongoAbility<AbilityTuple, MongoQuery> = defineAbility(() => {});

export const setRules = (rules: IAddRule[]) => {
  return defineAbility((can) => {
    rules.map((rule) => can(rule.action, rule.subject));
  });
};

export default ability;
