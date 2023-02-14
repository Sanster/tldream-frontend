import { TDExport, TLDR, Tldraw, TldrawApp, TldrawProps, useFileSystem } from '@tldraw/tldraw'
import * as React from 'react'
import { useUploadAssets } from '~hooks/useUploadAssets'
import * as gtag from '~utils/gtag'

declare const window: Window & { app: TldrawApp }

const API_ENDPOINT = ''

interface DiffusionParams {
  prompt: string
}

async function runModel(imageBlob: Blob, params: DiffusionParams) {
  const imageFile = new File([imageBlob], 'image', {
    type: 'image/jpeg',
  })
  const fd = new FormData()
  fd.append('image', imageFile)
  fd.append('prompt', params.prompt)
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
    const res = await runModel(info.blob, {
      prompt: app.state.appState.prompt,
    })
    const resFile = new File([res.blob], 'image.jpeg', {
      type: 'image/jpeg',
    })
    // app.selectAll()
    // const bounds = TLDR.getSelectedBounds(app.state)
    // const centerX = bounds.maxX + bounds.width / 2
    // const centerY = (bounds.minY + bounds.maxY) / 2
    // TODO: place the result to a better position
    // TODO: replace export padding, but keep padding used in onRunControlNet

    // TOOD: 添加推理参数输入框
    // TOOD: 添加模型推理 step 进度
    app.addMediaFromFiles([resFile])
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
