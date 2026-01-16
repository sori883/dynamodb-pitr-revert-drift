import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface Props {
  readonly vpc: ec2.IVpc;
  readonly SgVpce: ec2.ISecurityGroup;
  readonly vpceSubnets: ec2.SelectedSubnets;
}

export class VpcEndpoint extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);
    const { vpc, vpceSubnets, SgVpce } = props;

    vpc.addInterfaceEndpoint('SsmEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SSM,
      privateDnsEnabled: true,
      securityGroups: [SgVpce],
      subnets: vpceSubnets,
    });

    vpc.addInterfaceEndpoint('SsmMessageEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SSM_MESSAGES,
      privateDnsEnabled: true,
      securityGroups: [SgVpce],
      subnets: vpceSubnets,
    });

    vpc.addInterfaceEndpoint('Ec2MessageEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.EC2_MESSAGES,
      privateDnsEnabled: true,
      securityGroups: [SgVpce],
      subnets: vpceSubnets,
    });

    vpc.addGatewayEndpoint('S3GatewayEndpoint', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
      subnets: [vpceSubnets],
    });
  }
}
