import camelcase from 'camelcase';
import { SchemaDirectiveVisitor } from 'apollo-server-micro';
import { defaultFieldResolver } from 'graphql';
import Policy from 'Services/AuthorizationPolicy';

export default class ProtetedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const _this = this;

    field.resolve = async function(parent, _args, ctx, info) {
      const entityName =
        _this.args.entity ||
        field._parentEntity ||
        camelcase(info.parentType.name);

      if (
        await Policy.can(ctx.viewer)
          .perform(`${field.name}:read`)
          .on(parent, entityName)
      )
        return resolve.call(this, parent, _args, ctx, info);

      return null;
    };
  }
}
