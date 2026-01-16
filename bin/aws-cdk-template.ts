#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';

import { AppStack } from '../lib/app-stack';
import { DataStack } from '../lib/data-stack';
import { InfraStack } from '../lib/infra-stack';
import { parameter as p } from '../parameter';
import { validateEnvName } from '../parameter/envname-type';

const app = new cdk.App();

const env = validateEnvName(app.node.tryGetContext('env'));
const parameter = p(env);

cdk.Tags.of(app).add('Project', parameter.project);
cdk.Tags.of(app).add('Cost', parameter.cost);
cdk.Tags.of(app).add('Owner', parameter.owner);

const infra = new InfraStack(app, 'Infra', {
  stackName: `${parameter.prefix}-infra`,
  env: { account: parameter.dotEnv.ACCOUNT_ID, region: parameter.region },
  parameter,
});

new DataStack(app, 'Data', {
  stackName: `${parameter.prefix}-data`,
  env: { account: parameter.dotEnv.ACCOUNT_ID, region: parameter.region },
  parameter,
  vpc: infra.vpc,
  sgRds: infra.sgRds,
});

new AppStack(app, 'App', {
  stackName: `${parameter.prefix}-app`,
  env: { account: parameter.dotEnv.ACCOUNT_ID, region: parameter.region },
  parameter,
  vpc: infra.vpc,
  sgEc2: infra.sgEc2,
});
