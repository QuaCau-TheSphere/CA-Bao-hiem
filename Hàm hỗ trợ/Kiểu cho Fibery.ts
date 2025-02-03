// deno-lint-ignore-file no-explicit-any
export interface TrườngFibery {
  Name: string;
  Id: string;
}

export interface DescriptionFibery {
  Secret: string;
  Id: string;
}

export interface EntityFibery {
  Name: string;
  Description?: DescriptionFibery;
  Type?: string;
  "Public Id"?: string;
  Id?: string;
  "Created By"?: TrườngFibery;
  "Creation Date"?: string;
  "Modification Date"?: string;
  Rank?: number;
}

export interface ArgsFibery {
  steps: [];
  currentEntities: EntityFibery[];
  currentUser: {
    "Public Id": string;
    Id: string;
    Email: string;
    "Active?": boolean;
    "Admin?": boolean;
    "Guest?": boolean;
    "Creation Date": string;
    "Modification Date": string;
  };
}

export interface ContextFibery {
  getService: (service: "fibery" | "http" | "utils") => FiberyService | HttpService | UtilsService;
}

export interface FiberyService {
  getEntityById: (type: string, id: string, fields: string[]) => any;
  getEntitiesByIds: (type: string, ids: string[], fields: string[]) => any;
  createEntity: (type: string, values: object) => any;
  createEntityBatch: (type: string, entities: object[]) => any;
  updateEntity: (type: string, id: string, values: object) => any;
  updateEntityBatch: (type: string, entities: object[]) => any;
  addCollectionItem: (type: string, id: string, field: string, itemId: string) => any;
  addCollectionItemBatch: (type: string, field: string, args: { id: string; itemId: string }[]) => any;
  removeCollectionItem: (type: string, id: string, field: string, itemId: string) => any;
  removeCollectionItemBatch: (type: string, field: string, args: { id: string; itemId: string }[]) => any;
  deleteEntity: (type: string, id: string) => any;
  deleteEntityBatch: (type: string, ids: string[]) => any;
  setState: (type: string, id: string, state: string) => any;
  setStateToFinal: (type: string, id: string) => any;
  assignUser: (type: string, id: string, userId: string) => any;
  unassignUser: (type: string, id: string, userId: string) => any;
  getDocumentContent: (secret: string, format: string) => any;
  setDocumentContent: (secret: string, content: string, format: string) => any;
  appendDocumentContent: (secret: string, content: string, format: string) => any;
  addComment: (type: string, id: string, comment: string, authorId: string, format: string) => any;
  addFileFromUrl: (url: string, fileName: string, type: string, id: string, headers: object) => any;
  executeAction: (action: string, type: string, args: [object]) => any;
  executeSingleCommand: (command: FiberyCommand) => any;
  graphql: (spacename: string, command: string) => any;
  getSchema: () => any;
}

export interface HttpService {
  getAsync: (url: string, options?: { headers?: { [key: string]: string } }) => any;
  postAsync: (url: string, options?: { body?: any; headers?: { [key: string]: string } }) => any;
  putAsync: (url: string, options?: { body?: any; headers?: { [key: string]: string } }) => any;
  deleteAsync: (url: string, options?: { body?: any; headers?: { [key: string]: string } }) => any;
}

export interface UtilsService {
  getEntityUrl: (type: string, publicId: string) => any;
  getFileUrl: (fileSecret: string) => any;
  uuid: () => any;
}
