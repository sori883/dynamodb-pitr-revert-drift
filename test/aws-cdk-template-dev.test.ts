import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { InfraStack } from '../lib/infra-stack';
import { parameter as p } from '../parameter';
import { validateEnvName } from '../parameter/envname-type';

test('infraStack-snapshot-dev', () => {
  const app = new cdk.App({
    context: {
      env: 'dev',
    },
  });
  const env = validateEnvName(app.node.tryGetContext('env'));
  const parameter = p(env);

  const stack = new InfraStack(app, 'Infra', { parameter });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
