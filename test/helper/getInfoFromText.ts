import type { CompilerOptions, FileSystemHost, SyntaxKind } from '@ts-morph/common'
import { InMemoryFileSystemHost } from '@ts-morph/common'
import type { Node, SourceFile } from 'ts-morph'
import { Project } from 'ts-morph'

export declare type IsAny<T> = 0 extends (1 & T) ? true : false

export interface GetInfoFromTextOptions {
  isDefinitionFile?: boolean
  filePath?: string
  host?: FileSystemHost
  compilerOptions?: CompilerOptions
  includeLibDts?: boolean
  isJsx?: boolean
}

export interface GetInfoFromTextResult<TFirstChild extends Node> extends GetInfoFromTextInternalResult {
  // typescript bug fix in ts 3.5.1 (todo: check if this works by removing the conditional type in a future version)
  firstChild: IsAny<TFirstChild> extends true ? Node : TFirstChild
}

export interface GetInfoFromTextWithDescendantResult<TDescendant extends Node> extends GetInfoFromTextInternalResult {
  // typescript bug fix in ts 3.5.1 (todo: check if this works by removing the conditional type in a future version)
  descendant: IsAny<TDescendant> extends true ? Node : TDescendant
}

export interface GetInfoFromTextInternalResult {
  project: Project
  sourceFile: SourceFile
}

// I know type parameters aren't supposed to be used this way, but it's way too convenient
export function getInfoFromText<TFirstChild extends Node = Node>(text: string, opts?: GetInfoFromTextOptions): GetInfoFromTextResult<TFirstChild> {
  const info = getInfoFromTextInternal(text, opts)

  return {
    ...info,
    firstChild: info.sourceFile.forEachChild(child => child) as any,
  }
}

// todo: use the mapping between syntax kind and nodes for the descendant
export function getInfoFromTextWithDescendant<TDescendant extends Node>(
  text: string,
  descendantKind: SyntaxKind,
  opts?: GetInfoFromTextOptions,
): GetInfoFromTextWithDescendantResult<TDescendant> {
  const info = getInfoFromTextInternal(text, opts)
  return {
    ...info,
    descendant: info.sourceFile.getFirstDescendantByKindOrThrow(descendantKind) as any,
  }
}

function getInfoFromTextInternal(text: string, opts?: GetInfoFromTextOptions) {
  const {
    isDefinitionFile = false,
    isJsx = false,
    filePath = undefined,
    host = new InMemoryFileSystemHost(),
    compilerOptions = undefined,
    includeLibDts = false,
  } = opts || {}

  const project = new Project({ compilerOptions, fileSystem: host, skipLoadingLibFiles: !includeLibDts })
  const sourceFile = project.createSourceFile(getFilePath(), text)

  return { project, sourceFile }

  function getFilePath() {
    if (filePath != null)
      return filePath
    if (isJsx)
      return 'testFile.tsx'
    return isDefinitionFile ? 'testFile.d.ts' : 'testFile.ts'
  }
}
