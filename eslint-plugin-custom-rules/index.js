module.exports = {
  rules: {
    'restrict-react-router-imports': {
      create(context) {
        return {
          ImportDeclaration(node) {
            const { source, specifiers } = node;

            if (source.value === 'react-router-dom') {
              specifiers.forEach((specifier) => {
                // Check for both direct imports and aliased imports
                if (
                  specifier.type === 'ImportSpecifier' &&
                  ['Link', 'Navigate', 'useNavigate'].includes(specifier.imported.name)
                ) {
                  context.report({
                    node: specifier,
                    message:
                      "Import '{{name}}' from '~/common/routing' instead of 'react-router-dom'.",
                    data: {
                      name: specifier.imported.name,
                    },
                  });
                }
              });
            }
          },
        };
      },
    },
  },
};
