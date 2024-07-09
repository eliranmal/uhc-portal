class IPCIDR {
  address: string;

  constructor(address: string) {
    this.address = address;
  }

  start = () => this.address.split('/')[0];
}

export default IPCIDR;
