"use client"
import { Button } from "antd"

const ModalFooter = ({
  step,
  onCancel,
  onCreateTeam,
  onFinishUpload,
  onInvite,
  onDone,
  isNextDisabled,
  isInviteDisabled,
  uploading,
}) => {
  return (
    <div className="flex justify-between items-center">
      <Button onClick={onCancel} className="rounded-lg">
        Hủy
      </Button>

      <div className="flex gap-2">
        {step === 1 && (
          <Button type="primary" onClick={onCreateTeam} disabled={isNextDisabled} className="rounded-lg">
            Tiếp theo
          </Button>
        )}

        {step === 2 && (
          <>
            <Button onClick={onFinishUpload} className="rounded-lg" disabled={uploading}>
              Bỏ qua
            </Button>
            <Button type="primary" onClick={onFinishUpload} disabled={uploading} className="rounded-lg">
              Tiếp theo
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <Button onClick={onDone} className="rounded-lg">
              Bỏ qua
            </Button>
            <Button type="primary" onClick={onInvite} disabled={isInviteDisabled} className="rounded-lg">
              Mời
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default ModalFooter
