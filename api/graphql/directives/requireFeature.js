import { SchemaDirectiveVisitor } from 'apollo-server-micro';
import { defaultFieldResolver } from 'graphql';
import Policy from 'Services/AuthorizationPolicy';

export default class RequireFeature extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const _this = this;

    field.resolve = function(obj, _args, ctx, _info) {
      if (
        Policy.can(ctx.viewer)
          .perform(`:${_this.args.name}`)
          .on(undefined, 'features')
      )
        return resolve.call(this, obj, _args, ctx, _info);

      return null;
    };
  }
}
