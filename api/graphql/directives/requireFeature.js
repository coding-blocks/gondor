import { SchemaDirectiveVisitor } from 'apollo-server-micro';
import { defaultFieldResolver } from 'graphql';
import AuthPolicy from 'Services/AuthorizationPolicy';

export default class RequireFeature extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const _this = this;

    field.resolve = async function (parent, _args, ctx, _info) {
      if (
        await AuthPolicy.can(ctx.viewer)
          .perform(`features:${_this.args.name}`)
          .on(null)
      )
        return resolve.call(this, parent, _args, ctx, _info);

      return null;
    };
  }
}
