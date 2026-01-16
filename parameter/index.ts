import { RemovalPolicy } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

import type { EnvNameType } from './envname-type';
import { env } from './validate-dotenv';

export type ParameterType = ReturnType<typeof parameter>;

/**
 * .env、環境差分パラメータ、共通パラメータをまとめる
 * @param envName EnvNameType
 * @returns パラメータ
 */
export const parameter = (envName: EnvNameType) => ({
  prefix: envName,
  region: 'ap-northeast-1',
  owner: 'sori883',
  project: 'cdk-template',
  cost: `cdk-template-${envName}`,
  // .envパラメータ
  dotEnv: { ...env },
  // 環境差分パラメータ
  diffEnv: envDiffParameter(envName),
});

/**
 * 環境差分があるパラメータを定義する
 * 例：性能パラメータなど
 * @param envName EnvNameType
 * @returns 環境差分パラメータ
 */
const envDiffParameter = (envName: EnvNameType) => {
  const params = {
    prd: {
      vpc: {
        cidr: '10.0.0.0/16',
        maxAzs: 3,
        publicNats: 3,
        subnets: {
          EgressPrivate: {
            name: 'EgressPrivate',
            subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
            cidrMask: 24,
          },
          Private: {
            name: 'Private',
            subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            cidrMask: 24,
          },
        },
      },
      ec2: {
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.T3,
          ec2.InstanceSize.LARGE
        ),
      },
      rds: {
        version: rds.AuroraPostgresEngineVersion.VER_17_6,
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.R5,
          ec2.InstanceSize.LARGE
        ),
        removalPolicy: RemovalPolicy.SNAPSHOT,
        deletionProtection: true,
        backupDays: 30,
      },
    },
    stg: {
      vpc: {
        cidr: '10.0.0.0/16',
        maxAzs: 2,
        publicNats: 1,
        subnets: {
          EgressPrivate: {
            name: 'EgressPrivate',
            subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            cidrMask: 24,
          },
          Private: {
            name: 'Private',
            subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            cidrMask: 24,
          },
        },
      },
      ec2: {
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.T3,
          ec2.InstanceSize.MICRO
        ),
      },
      rds: {
        version: rds.AuroraPostgresEngineVersion.VER_17_6,
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.R5,
          ec2.InstanceSize.LARGE
        ),
        removalPolicy: RemovalPolicy.DESTROY,
        deletionProtection: false,
        backupDays: 1,
      },
    },
    dev: {
      vpc: {
        cidr: '10.0.0.0/16',
        maxAzs: 2,
        publicNats: 1,
        subnets: {
          EgressPrivate: {
            name: 'EgressPrivate',
            subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
            cidrMask: 24,
          },
          Private: {
            name: 'Private',
            subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            cidrMask: 24,
          },
        },
      },
      ec2: {
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.T3,
          ec2.InstanceSize.MICRO
        ),
      },
      rds: {
        version: rds.AuroraPostgresEngineVersion.VER_17_6,
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.R5,
          ec2.InstanceSize.LARGE
        ),
        removalPolicy: RemovalPolicy.DESTROY,
        deletionProtection: false,
        backupDays: 1,
      },
    },
  };
  return params[envName];
};
