import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface Props {
  readonly publicNats: number;
  readonly cidr: string;
  readonly maxAzs: number;
  readonly subnetConfigs: ec2.SubnetConfiguration[];
}

export class Vpc extends Construct {
  public readonly vpc: ec2.IVpc;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);
    const { publicNats, cidr, maxAzs, subnetConfigs } = props;

    /**
     * NATが必要か否かでPublicにするか定義
     */
    const isInternet =
      publicNats > 0
        ? {
            natGateways: publicNats,
            natGatewaySubnets: {
              subnetGroupName: 'NatPublic',
            },
          }
        : null;

    /**
     * VPC作成
     */
    this.vpc = new ec2.Vpc(this, 'Vpc', {
      ipAddresses: ec2.IpAddresses.cidr(cidr),
      maxAzs: maxAzs,
      ...isInternet,
      subnetConfiguration: [
        ...Object.values(subnetConfigs),
        ...((isInternet && [
          {
            name: 'NatPublic',
            subnetType: ec2.SubnetType.PUBLIC,
            cidrMask: 26,
            mapPublicIpOnLaunch: false,
          },
        ]) ||
          []),
      ],
    });
  }
}
