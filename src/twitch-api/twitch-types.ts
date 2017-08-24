export interface EmoteSet {
  [key: string]: [{
    code: string;
    id: number;
  }];
}


export interface GetEmoteSetsResponse {
  emoticon_sets: EmoteSet;
}
