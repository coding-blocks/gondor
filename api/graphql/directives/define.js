import { SchemaDirectiveVisitor } from 'apollo-server-micro';
import { defaultFieldResolver } from 'graphql';

export default class DefineDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    type._entity = this.args.entity;
    const fields = type.getFields();

    Object.values(fields).forEach(
      (value) => (value._parentEntity = this.args.entity),
    );
  }
}
