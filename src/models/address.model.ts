import { BaseModel } from './base.model';

export class AddressModel extends BaseModel {
  addrNmAddress: string;
  addrCdType: string;
  addrDsAddress: string;
  addrDsNumber: string;
  addrDsComplement: string;
  addrNmDistrict: string;
  addrNmCity: string;
  addrSgState: string;
  addrCdZipcode: string;

  constructor() {
    super();
    this.addrCdType = '';
    this.addrNmAddress = '';
    this.addrDsAddress = '';
    this.addrDsNumber = '';
    this.addrDsComplement = '';
    this.addrNmDistrict = '';
    this.addrNmCity = '';
    this.addrSgState = '';
    this.addrCdZipcode = '';
  }
}
