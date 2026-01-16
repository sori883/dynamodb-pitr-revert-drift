import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface Props {
  readonly vpc: ec2.IVpc;
}

export class SgApp extends Construct {
  public readonly sgEc2: ec2.ISecurityGroup;
  public readonly sgRds: ec2.ISecurityGroup;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);
    const { vpc } = props;

    this.sgEc2 = new ec2.SecurityGroup(this, 'Ec2SG', {
      vpc: vpc,
      description: 'Security group for EC2',
      allowAllOutbound: true,
    });

    this.sgRds = new ec2.SecurityGroup(this, 'RdsSG', {
      vpc: vpc,
      description: 'Security group for RDS',
      allowAllOutbound: true,
    });

    // RDSのインバウンドでEC2を許可
    this.sgRds.addIngressRule(
      ec2.Peer.securityGroupId(this.sgEc2.securityGroupId),
      ec2.Port.tcp(5432),
      'Allow PostgreSql from EC2'
    );
  }
}
