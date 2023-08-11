import { BaseModel } from './base.model';

export class SegmentModel extends BaseModel {
  segmNmSegment: string;

  constructor() {
    super();
    this.segmNmSegment = '';
  }
}
