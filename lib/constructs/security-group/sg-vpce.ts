import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface Props {
  readonly vpc: ec2.IVpc;
}

export class SgVpce extends Construct {
  public readonly sgVpce: ec2.ISecurityGroup;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);
    const { vpc } = props;

    this.sgVpce = new ec2.SecurityGroup(this, 'VpcEndpointSG', {
      vpc: vpc,
      description: 'Security group for VPC Endpoints',
      allowAllOutbound: true,
    });
    // VPCからのHTTPS通信を許可
    this.sgVpce.addIngressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcp(443),
      'Allow HTTPS from VPC'
    );
  }
}
