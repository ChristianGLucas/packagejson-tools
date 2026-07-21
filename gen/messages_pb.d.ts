// package: christiangeorgelucas.packagejson_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class Error extends jspb.Message {
  getCode(): string;
  setCode(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Error.AsObject;
  static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Error;
  static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
}

export namespace Error {
  export type AsObject = {
    code: string,
    message: string,
  }
}

export class DependencyEntry extends jspb.Message {
  getSection(): string;
  setSection(value: string): void;

  getName(): string;
  setName(value: string): void;

  getRawSpec(): string;
  setRawSpec(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DependencyEntry.AsObject;
  static toObject(includeInstance: boolean, msg: DependencyEntry): DependencyEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DependencyEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DependencyEntry;
  static deserializeBinaryFromReader(message: DependencyEntry, reader: jspb.BinaryReader): DependencyEntry;
}

export namespace DependencyEntry {
  export type AsObject = {
    section: string,
    name: string,
    rawSpec: string,
  }
}

export class ManifestRequest extends jspb.Message {
  getManifestJson(): string;
  setManifestJson(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ManifestRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ManifestRequest): ManifestRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ManifestRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ManifestRequest;
  static deserializeBinaryFromReader(message: ManifestRequest, reader: jspb.BinaryReader): ManifestRequest;
}

export namespace ManifestRequest {
  export type AsObject = {
    manifestJson: string,
  }
}

export class ManifestSummary extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getMain(): string;
  setMain(value: string): void;

  getModule(): string;
  setModule(value: string): void;

  getTypes(): string;
  setTypes(value: string): void;

  getLicense(): string;
  setLicense(value: string): void;

  getPrivate(): boolean;
  setPrivate(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ManifestSummary.AsObject;
  static toObject(includeInstance: boolean, msg: ManifestSummary): ManifestSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ManifestSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ManifestSummary;
  static deserializeBinaryFromReader(message: ManifestSummary, reader: jspb.BinaryReader): ManifestSummary;
}

export namespace ManifestSummary {
  export type AsObject = {
    name: string,
    version: string,
    description: string,
    main: string,
    module: string,
    types: string,
    license: string,
    pb_private: boolean,
    error?: Error.AsObject,
  }
}

export class DependencyList extends jspb.Message {
  clearDepsList(): void;
  getDepsList(): Array<DependencyEntry>;
  setDepsList(value: Array<DependencyEntry>): void;
  addDeps(value?: DependencyEntry, index?: number): DependencyEntry;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DependencyList.AsObject;
  static toObject(includeInstance: boolean, msg: DependencyList): DependencyList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DependencyList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DependencyList;
  static deserializeBinaryFromReader(message: DependencyList, reader: jspb.BinaryReader): DependencyList;
}

export namespace DependencyList {
  export type AsObject = {
    depsList: Array<DependencyEntry.AsObject>,
    error?: Error.AsObject,
  }
}

export class DependencyMap extends jspb.Message {
  getDependenciesMap(): jspb.Map<string, string>;
  clearDependenciesMap(): void;
  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DependencyMap.AsObject;
  static toObject(includeInstance: boolean, msg: DependencyMap): DependencyMap.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DependencyMap, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DependencyMap;
  static deserializeBinaryFromReader(message: DependencyMap, reader: jspb.BinaryReader): DependencyMap;
}

export namespace DependencyMap {
  export type AsObject = {
    dependenciesMap: Array<[string, string]>,
    error?: Error.AsObject,
  }
}

export class PeerDependencyEntry extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getRawSpec(): string;
  setRawSpec(value: string): void;

  getOptional(): boolean;
  setOptional(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PeerDependencyEntry.AsObject;
  static toObject(includeInstance: boolean, msg: PeerDependencyEntry): PeerDependencyEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PeerDependencyEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PeerDependencyEntry;
  static deserializeBinaryFromReader(message: PeerDependencyEntry, reader: jspb.BinaryReader): PeerDependencyEntry;
}

export namespace PeerDependencyEntry {
  export type AsObject = {
    name: string,
    rawSpec: string,
    optional: boolean,
  }
}

export class PeerDependencyList extends jspb.Message {
  clearPeersList(): void;
  getPeersList(): Array<PeerDependencyEntry>;
  setPeersList(value: Array<PeerDependencyEntry>): void;
  addPeers(value?: PeerDependencyEntry, index?: number): PeerDependencyEntry;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PeerDependencyList.AsObject;
  static toObject(includeInstance: boolean, msg: PeerDependencyList): PeerDependencyList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PeerDependencyList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PeerDependencyList;
  static deserializeBinaryFromReader(message: PeerDependencyList, reader: jspb.BinaryReader): PeerDependencyList;
}

export namespace PeerDependencyList {
  export type AsObject = {
    peersList: Array<PeerDependencyEntry.AsObject>,
    error?: Error.AsObject,
  }
}

export class DependencySpecRequest extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getSpec(): string;
  setSpec(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DependencySpecRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DependencySpecRequest): DependencySpecRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DependencySpecRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DependencySpecRequest;
  static deserializeBinaryFromReader(message: DependencySpecRequest, reader: jspb.BinaryReader): DependencySpecRequest;
}

export namespace DependencySpecRequest {
  export type AsObject = {
    name: string,
    spec: string,
  }
}

export class DependencySpecResult extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getName(): string;
  setName(value: string): void;

  getRaw(): string;
  setRaw(value: string): void;

  getFetchSpec(): string;
  setFetchSpec(value: string): void;

  getGitCommittish(): string;
  setGitCommittish(value: string): void;

  getGitRange(): string;
  setGitRange(value: string): void;

  getHosted(): boolean;
  setHosted(value: boolean): void;

  getHostType(): string;
  setHostType(value: string): void;

  getRegistry(): boolean;
  setRegistry(value: boolean): void;

  getScope(): string;
  setScope(value: string): void;

  getSubSpec(): string;
  setSubSpec(value: string): void;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DependencySpecResult.AsObject;
  static toObject(includeInstance: boolean, msg: DependencySpecResult): DependencySpecResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DependencySpecResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DependencySpecResult;
  static deserializeBinaryFromReader(message: DependencySpecResult, reader: jspb.BinaryReader): DependencySpecResult;
}

export namespace DependencySpecResult {
  export type AsObject = {
    type: string,
    name: string,
    raw: string,
    fetchSpec: string,
    gitCommittish: string,
    gitRange: string,
    hosted: boolean,
    hostType: string,
    registry: boolean,
    scope: string,
    subSpec: string,
    error?: Error.AsObject,
  }
}

export class ClassificationCount extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClassificationCount.AsObject;
  static toObject(includeInstance: boolean, msg: ClassificationCount): ClassificationCount.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClassificationCount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClassificationCount;
  static deserializeBinaryFromReader(message: ClassificationCount, reader: jspb.BinaryReader): ClassificationCount;
}

export namespace ClassificationCount {
  export type AsObject = {
    type: string,
    count: number,
  }
}

export class DependencyClassification extends jspb.Message {
  clearCountsList(): void;
  getCountsList(): Array<ClassificationCount>;
  setCountsList(value: Array<ClassificationCount>): void;
  addCounts(value?: ClassificationCount, index?: number): ClassificationCount;

  getTotal(): number;
  setTotal(value: number): void;

  clearUnparseableList(): void;
  getUnparseableList(): Array<DependencyEntry>;
  setUnparseableList(value: Array<DependencyEntry>): void;
  addUnparseable(value?: DependencyEntry, index?: number): DependencyEntry;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DependencyClassification.AsObject;
  static toObject(includeInstance: boolean, msg: DependencyClassification): DependencyClassification.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DependencyClassification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DependencyClassification;
  static deserializeBinaryFromReader(message: DependencyClassification, reader: jspb.BinaryReader): DependencyClassification;
}

export namespace DependencyClassification {
  export type AsObject = {
    countsList: Array<ClassificationCount.AsObject>,
    total: number,
    unparseableList: Array<DependencyEntry.AsObject>,
    error?: Error.AsObject,
  }
}

export class ScriptMap extends jspb.Message {
  getScriptsMap(): jspb.Map<string, string>;
  clearScriptsMap(): void;
  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ScriptMap.AsObject;
  static toObject(includeInstance: boolean, msg: ScriptMap): ScriptMap.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ScriptMap, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ScriptMap;
  static deserializeBinaryFromReader(message: ScriptMap, reader: jspb.BinaryReader): ScriptMap;
}

export namespace ScriptMap {
  export type AsObject = {
    scriptsMap: Array<[string, string]>,
    error?: Error.AsObject,
  }
}

export class EngineMap extends jspb.Message {
  getEnginesMap(): jspb.Map<string, string>;
  clearEnginesMap(): void;
  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EngineMap.AsObject;
  static toObject(includeInstance: boolean, msg: EngineMap): EngineMap.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EngineMap, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EngineMap;
  static deserializeBinaryFromReader(message: EngineMap, reader: jspb.BinaryReader): EngineMap;
}

export namespace EngineMap {
  export type AsObject = {
    enginesMap: Array<[string, string]>,
    error?: Error.AsObject,
  }
}

export class BinMap extends jspb.Message {
  getBinMap(): jspb.Map<string, string>;
  clearBinMap(): void;
  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BinMap.AsObject;
  static toObject(includeInstance: boolean, msg: BinMap): BinMap.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BinMap, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BinMap;
  static deserializeBinaryFromReader(message: BinMap, reader: jspb.BinaryReader): BinMap;
}

export namespace BinMap {
  export type AsObject = {
    binMap: Array<[string, string]>,
    error?: Error.AsObject,
  }
}

export class ExportsEntry extends jspb.Message {
  getSubpath(): string;
  setSubpath(value: string): void;

  getTargetJson(): string;
  setTargetJson(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExportsEntry.AsObject;
  static toObject(includeInstance: boolean, msg: ExportsEntry): ExportsEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExportsEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExportsEntry;
  static deserializeBinaryFromReader(message: ExportsEntry, reader: jspb.BinaryReader): ExportsEntry;
}

export namespace ExportsEntry {
  export type AsObject = {
    subpath: string,
    targetJson: string,
  }
}

export class ExportsImportsResult extends jspb.Message {
  clearExportsList(): void;
  getExportsList(): Array<ExportsEntry>;
  setExportsList(value: Array<ExportsEntry>): void;
  addExports(value?: ExportsEntry, index?: number): ExportsEntry;

  clearImportsList(): void;
  getImportsList(): Array<ExportsEntry>;
  setImportsList(value: Array<ExportsEntry>): void;
  addImports(value?: ExportsEntry, index?: number): ExportsEntry;

  getExportsRawJson(): string;
  setExportsRawJson(value: string): void;

  getImportsRawJson(): string;
  setImportsRawJson(value: string): void;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExportsImportsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExportsImportsResult): ExportsImportsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExportsImportsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExportsImportsResult;
  static deserializeBinaryFromReader(message: ExportsImportsResult, reader: jspb.BinaryReader): ExportsImportsResult;
}

export namespace ExportsImportsResult {
  export type AsObject = {
    exportsList: Array<ExportsEntry.AsObject>,
    importsList: Array<ExportsEntry.AsObject>,
    exportsRawJson: string,
    importsRawJson: string,
    error?: Error.AsObject,
  }
}

export class WorkspaceList extends jspb.Message {
  clearGlobsList(): void;
  getGlobsList(): Array<string>;
  setGlobsList(value: Array<string>): void;
  addGlobs(value: string, index?: number): string;

  getIsMonorepo(): boolean;
  setIsMonorepo(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WorkspaceList.AsObject;
  static toObject(includeInstance: boolean, msg: WorkspaceList): WorkspaceList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WorkspaceList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WorkspaceList;
  static deserializeBinaryFromReader(message: WorkspaceList, reader: jspb.BinaryReader): WorkspaceList;
}

export namespace WorkspaceList {
  export type AsObject = {
    globsList: Array<string>,
    isMonorepo: boolean,
    error?: Error.AsObject,
  }
}

export class RepositoryInfo extends jspb.Message {
  getRepositoryUrl(): string;
  setRepositoryUrl(value: string): void;

  getRepositoryType(): string;
  setRepositoryType(value: string): void;

  getRepositoryDirectory(): string;
  setRepositoryDirectory(value: string): void;

  getBugsUrl(): string;
  setBugsUrl(value: string): void;

  getBugsEmail(): string;
  setBugsEmail(value: string): void;

  getHomepage(): string;
  setHomepage(value: string): void;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RepositoryInfo.AsObject;
  static toObject(includeInstance: boolean, msg: RepositoryInfo): RepositoryInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RepositoryInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RepositoryInfo;
  static deserializeBinaryFromReader(message: RepositoryInfo, reader: jspb.BinaryReader): RepositoryInfo;
}

export namespace RepositoryInfo {
  export type AsObject = {
    repositoryUrl: string,
    repositoryType: string,
    repositoryDirectory: string,
    bugsUrl: string,
    bugsEmail: string,
    homepage: string,
    error?: Error.AsObject,
  }
}

export class NameRequest extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: NameRequest): NameRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NameRequest;
  static deserializeBinaryFromReader(message: NameRequest, reader: jspb.BinaryReader): NameRequest;
}

export namespace NameRequest {
  export type AsObject = {
    name: string,
  }
}

export class NameValidationResult extends jspb.Message {
  getValidForNewPackages(): boolean;
  setValidForNewPackages(value: boolean): void;

  getValidForOldPackages(): boolean;
  setValidForOldPackages(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<string>;
  setErrorsList(value: Array<string>): void;
  addErrors(value: string, index?: number): string;

  clearWarningsList(): void;
  getWarningsList(): Array<string>;
  setWarningsList(value: Array<string>): void;
  addWarnings(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NameValidationResult.AsObject;
  static toObject(includeInstance: boolean, msg: NameValidationResult): NameValidationResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NameValidationResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NameValidationResult;
  static deserializeBinaryFromReader(message: NameValidationResult, reader: jspb.BinaryReader): NameValidationResult;
}

export namespace NameValidationResult {
  export type AsObject = {
    validForNewPackages: boolean,
    validForOldPackages: boolean,
    errorsList: Array<string>,
    warningsList: Array<string>,
  }
}

export class ModuleTypeResult extends jspb.Message {
  getModuleType(): string;
  setModuleType(value: string): void;

  getExplicit(): boolean;
  setExplicit(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ModuleTypeResult.AsObject;
  static toObject(includeInstance: boolean, msg: ModuleTypeResult): ModuleTypeResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ModuleTypeResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ModuleTypeResult;
  static deserializeBinaryFromReader(message: ModuleTypeResult, reader: jspb.BinaryReader): ModuleTypeResult;
}

export namespace ModuleTypeResult {
  export type AsObject = {
    moduleType: string,
    explicit: boolean,
    error?: Error.AsObject,
  }
}

export class FilesList extends jspb.Message {
  clearFilesList(): void;
  getFilesList(): Array<string>;
  setFilesList(value: Array<string>): void;
  addFiles(value: string, index?: number): string;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FilesList.AsObject;
  static toObject(includeInstance: boolean, msg: FilesList): FilesList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FilesList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FilesList;
  static deserializeBinaryFromReader(message: FilesList, reader: jspb.BinaryReader): FilesList;
}

export namespace FilesList {
  export type AsObject = {
    filesList: Array<string>,
    error?: Error.AsObject,
  }
}

export class ManifestDiffRequest extends jspb.Message {
  getManifestJsonA(): string;
  setManifestJsonA(value: string): void;

  getManifestJsonB(): string;
  setManifestJsonB(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ManifestDiffRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ManifestDiffRequest): ManifestDiffRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ManifestDiffRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ManifestDiffRequest;
  static deserializeBinaryFromReader(message: ManifestDiffRequest, reader: jspb.BinaryReader): ManifestDiffRequest;
}

export namespace ManifestDiffRequest {
  export type AsObject = {
    manifestJsonA: string,
    manifestJsonB: string,
  }
}

export class DependencyChange extends jspb.Message {
  getSection(): string;
  setSection(value: string): void;

  getName(): string;
  setName(value: string): void;

  getOldSpec(): string;
  setOldSpec(value: string): void;

  getNewSpec(): string;
  setNewSpec(value: string): void;

  getChangeType(): string;
  setChangeType(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DependencyChange.AsObject;
  static toObject(includeInstance: boolean, msg: DependencyChange): DependencyChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DependencyChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DependencyChange;
  static deserializeBinaryFromReader(message: DependencyChange, reader: jspb.BinaryReader): DependencyChange;
}

export namespace DependencyChange {
  export type AsObject = {
    section: string,
    name: string,
    oldSpec: string,
    newSpec: string,
    changeType: string,
  }
}

export class ManifestDiff extends jspb.Message {
  clearAddedList(): void;
  getAddedList(): Array<DependencyChange>;
  setAddedList(value: Array<DependencyChange>): void;
  addAdded(value?: DependencyChange, index?: number): DependencyChange;

  clearRemovedList(): void;
  getRemovedList(): Array<DependencyChange>;
  setRemovedList(value: Array<DependencyChange>): void;
  addRemoved(value?: DependencyChange, index?: number): DependencyChange;

  clearChangedList(): void;
  getChangedList(): Array<DependencyChange>;
  setChangedList(value: Array<DependencyChange>): void;
  addChanged(value?: DependencyChange, index?: number): DependencyChange;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ManifestDiff.AsObject;
  static toObject(includeInstance: boolean, msg: ManifestDiff): ManifestDiff.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ManifestDiff, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ManifestDiff;
  static deserializeBinaryFromReader(message: ManifestDiff, reader: jspb.BinaryReader): ManifestDiff;
}

export namespace ManifestDiff {
  export type AsObject = {
    addedList: Array<DependencyChange.AsObject>,
    removedList: Array<DependencyChange.AsObject>,
    changedList: Array<DependencyChange.AsObject>,
    error?: Error.AsObject,
  }
}

