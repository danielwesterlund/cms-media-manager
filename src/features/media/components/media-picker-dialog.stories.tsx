import { MediaPickerDialog } from '@/features/media/components/media-picker-dialog';

const meta = {
  title: 'Features/Media/MediaPickerDialog',
  component: MediaPickerDialog,
  args: {
    open: true,
    context: 'attachments',
    attachmentsSelectionOrderedIds: ['ast_0001', 'ast_0002', 'ast_0003'],
    onOpenChange: () => undefined,
    onChangeAttachmentsOrder: () => undefined
  }
};

export default meta;

export const Attachments = {};
