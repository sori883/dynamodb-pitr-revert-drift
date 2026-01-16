import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface Props {
  readonly vpc: ec2.IVpc;
  readonly securityGroup: ec2.ISecurityGroup;
  readonly subnet: ec2.ISubnet;
  readonly instanceType: ec2.InstanceType;
}

export class Ec2 extends Construct {
  public readonly instance: ec2.IInstance;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);
    const { vpc, securityGroup, subnet, instanceType } = props;

    // Eキーペア
    const keyPair = new ec2.KeyPair(this, 'MyKeyPair', {
      type: ec2.KeyPairType.RSA,
      format: ec2.KeyPairFormat.PEM,
    });

    // ロール
    const role = new iam.Role(this, 'InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AmazonSSMManagedInstanceCore'
        ),
      ],
    });

    // ALの最新イメージを取得
    const machineImage = ec2.MachineImage.latestAmazonLinux2023({
      cpuType: ec2.AmazonLinuxCpuType.X86_64,
    });

    // EC2
    this.instance = new ec2.Instance(this, 'Instance', {
      vpc,
      vpcSubnets: { subnets: [subnet] },
      instanceType: instanceType,
      machineImage,
      securityGroup,
      keyPair,
      role,
    });
  }
}
