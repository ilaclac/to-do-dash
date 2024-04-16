import { useEffect, useRef, FC } from 'react';
import clsx from 'clsx';
import { Button } from '@/src/ui/button';
import {
  TrashIcon,
  PencilSquareIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';
import { TodoTableProps } from '@/src/lib/definitions';
export const TodoTable: FC<TodoTableProps> = ({
  items,
  onDeleteItem,
  onEditItem,
  onSaveItem,
  onItemChange,
  onCancelEdit,
  onToggleDone,
  editingItemId,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Automatically focus the input field when it becomes visible
    if (inputRef.current && editingItemId !== null) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingItemId]);

  const handleKeyDown = (
    event: React.KeyboardEvent,
    id: string,
    title: string,
  ) => {
    if (event.key === 'Enter') {
      // Save
      onSaveItem(id, title);
    } else if (event.key === 'Escape') {
      // On ESC return old state and end editing
      onCancelEdit();
    }
  };

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {items?.map(
            (item: { id: string; title: string; done: boolean }, i: number) => {
              return (
                <div
                  key={item.id}
                  className={clsx(
                    'flex flex-row items-center justify-between py-4 xs:flex xs:flex-col xs:items-center',
                    {
                      'border-t': i !== 0,
                    },
                  )}
                >
                  <div className="flex items-center">
                    <div className="min-w-0">
                      {editingItemId === item.id ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            onItemChange(item.id, e.target.value)
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(e, item.id, item.title)
                          }
                          className="text-sm font-semibold md:text-base"
                        />
                      ) : (
                        <p
                          className={clsx(
                            'transform cursor-pointer truncate text-sm font-semibold hover:scale-110 hover:text-red-500 md:text-base',
                            { 'italic text-gray-500 line-through': item.done },
                          )}
                          onClick={() => onToggleDone(item.id)}
                        >
                          {item.title}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex items-end pb-2 pt-6">
                      {editingItemId === item.id ? (
                        <Button onClick={() => onSaveItem(item.id, item.title)}>
                          Save <CheckIcon className="ml-2 h-5 w-5" />
                        </Button>
                      ) : (
                        <Button onClick={() => onEditItem(item.id)}>
                          Edit <PencilSquareIcon className="ml-2 h-5 w-5" />
                        </Button>
                      )}
                    </div>
                    <div className="end flex pb-2 pt-6">
                      <Button
                        className="ml-2 bg-red-500 text-sm text-gray-500"
                        onClick={() => onDeleteItem(item.id)}
                      >
                        Delete Item
                        <TrashIcon className="h-5 w-5 text-yellow-200" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
};
