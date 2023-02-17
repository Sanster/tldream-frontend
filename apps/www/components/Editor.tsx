import {
  DiffusionParams,
  TDExport,
  TDSnapshot,
  TLDR,
  Tldraw,
  TldrawApp,
  TldrawProps,
  useFileSystem,
} from '@tldraw/tldraw'
import Vec from '@tldraw/vec'
import * as React from 'react'
import { useUploadAssets } from '~hooks/useUploadAssets'
import * as gtag from '~utils/gtag'

declare const window: Window & { app: TldrawApp }

const API_ENDPOINT = ''

async function runModel(imageBlob: Blob, params: DiffusionParams) {
  const imageFile = new File([imageBlob], 'image', {
    type: 'image/jpeg',
  })
  const fd = new FormData()
  fd.append('image', imageFile)
  fd.append('prompt', params.prompt)
  fd.append('steps', params.steps.toString())
  fd.append('guidance_scale', params.guidanceScale.toString())
  fd.append('negative_prompt', params.negativePrompt.toString())
  fd.append('width', params.width.toString())
  fd.append('height', params.height.toString())

  try {
    const res = await fetch(`http://127.0.0.1:4242/run`, {
      method: 'POST',
      body: fd,
    })
    if (res.ok) {
      const blob = await res.blob()
      return { blob: blob }
    }
    const errMsg = await res.text()
    throw Error(errMsg)
  } catch (error) {
    throw Error(`Something went wrong: ${error}`)
  }
}

interface EditorProps {
  id?: string
}

const Editor = ({ id = 'home', ...rest }: EditorProps & Partial<TldrawProps>) => {
  const handleMount = React.useCallback((app: TldrawApp) => {
    window.app = app
  }, [])

  // Send events to gtag as actions.
  const handlePersist = React.useCallback((_app: TldrawApp, reason?: string) => {
    gtag.event({
      action: reason ?? '',
      category: 'editor',
      label: reason ?? 'persist',
      value: 0,
    })
  }, [])

  const fileSystemEvents = useFileSystem()

  const { onAssetUpload } = useUploadAssets()

  const onRunControlNet = async (app: TldrawApp, info: TDExport) => {
    app.setIsRunningModel(true)
    // TOOD: 添加模型推理 step 进度
    const res = await runModel(
      info.blob,
      app.document.pageDiffusionParams[app.appState.currentPageId]
    )
    const resFile = new File([res.blob], 'image.jpeg', {
      type: 'image/jpeg',
    })
    // const bounds = TLDR.getAllStrokeBounds(app.state)
    // const x = bounds.maxX + bounds.width / 2
    // const y = bounds.minY + bounds.height / 2
    // TODO: place to a better position
    app.addMediaFromFiles([resFile])
    app.setIsRunningModel(false)
  }

  return (
    <div className="tldraw">
      <Tldraw
        id={id}
        autofocus
        onMount={handleMount}
        onPersist={handlePersist}
        onAssetUpload={onAssetUpload}
        disableAssets={true}
        showMenu={false}
        showMultiplayerMenu={false}
        darkMode={false}
        onRunControlNet={onRunControlNet}
        {...fileSystemEvents}
        {...rest}
      />
    </div>
  )
}

export default Editor
