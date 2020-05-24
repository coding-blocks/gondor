import camelcase from 'camelcase';
import { SchemaDirectiveVisitor } from 'apollo-server-micro';
import { defaultFieldResolver } from 'graphql';
import AuthPolicy from 'Services/AuthorizationPolicy';

export default class ProtetedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const _this = this;

    field.resolve = async function (parent, _args, ctx, info) {
      const entityName =
        _this.args.entity ||
        field._parentEntity ||
        camelcase(info.parentType.name);

      const postExecution = _this.args.post_execution;

      if (postExecution === true) {
        const entity = resolve.call(this, parent, _args, ctx, info);

        if (
          await AuthPolicy.can(ctx.viewer)
            .perform(`${entity}:${field.name}:read`)
            .on(parent)
        )
          return entity;
      }

      if (
        await AuthPolicy.can(ctx.viewer)
          .perform(`${entityName}:${field.name}:read`)
          .on(parent)
      )
        return resolve.call(this, parent, _args, ctx, info);

      return null;
    };
  }
}
