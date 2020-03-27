import { SchemaDirectiveVisitor } from 'apollo-server-micro';
import { defaultFieldResolver } from 'graphql';
import Policy from 'Services/AuthorizationPolicy';

export default class AuthorizeDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const _this = this;

    field.resolve = function(obj, _args, ctx, _info) {
      if (
        Policy.can(ctx.viewer)
          .perform(`${field.name}:read`)
          .on(obj, _this.args.entity || field._parentEntity || field.name)
      )
        return resolve.call(this, obj, _args, ctx, _info);

      return null;
    };
  }
}
