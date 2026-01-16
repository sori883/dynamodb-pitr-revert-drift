import type { RemovalPolicy } from 'aws-cdk-lib';
import type * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Duration } from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

interface Props {
  readonly vpc: ec2.IVpc;
  readonly securityGroup: ec2.ISecurityGroup;
  readonly subnetGroup: ec2.SubnetSelection;
  readonly version: rds.AuroraPostgresEngineVersion;
  readonly instanceType: ec2.InstanceType;
  readonly removalPolicy: RemovalPolicy;
  readonly deletionProtection: boolean;
  readonly backupDays: number;
}

export class Rds extends Construct {
  public readonly cluster: rds.IDatabaseCluster;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);
    const {
      vpc,
      securityGroup,
      subnetGroup,
      version,
      instanceType,
      removalPolicy,
      deletionProtection,
      backupDays,
    } = props;

    // サブネットグループ
    const dbSubnetGroup = new rds.SubnetGroup(this, 'SubnetGroup', {
      vpc,
      description: 'Subnet group for Aurora',
      vpcSubnets: subnetGroup,
    });

    // クラスター
    this.cluster = new rds.DatabaseCluster(this, 'Cluster', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version,
      }),
      writer: rds.ClusterInstance.provisioned('Writer', {
        instanceType,
      }),
      vpc,
      vpcSubnets: subnetGroup,
      securityGroups: [securityGroup],
      subnetGroup: dbSubnetGroup,
      storageEncrypted: true,
      removalPolicy,
      deletionProtection,
      backup: {
        retention: Duration.days(backupDays),
      },
    });
  }
}
