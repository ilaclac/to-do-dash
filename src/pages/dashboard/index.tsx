import { SideNav } from '@/src/ui/dashboard/sidenav';
import { TodoTable } from '@/src/ui/dashboard/todo-table';
import { lusitana } from '@/src/ui/fonts';
import { useEffect, useState } from 'react';
import { ToDoListSkeleton } from '@/src/ui/toDoListSkeleton';
import { Metadata } from 'next';
import { fetchApi } from '@/src/lib/fetchApi';
import {
  GET_ITEMS_ROUTE,
  ADD_ITEMS_ROUTE,
  DELETE_ITEMS_ROUTE,
  UPDATE_ITEMS_ROUTE,
} from '@/src/constants';
import {
  BookmarkIcon,
  PlusIcon,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/solid';
import { Button } from '@/src/ui/button';
import clsx from 'clsx';
import { Item } from '@/src/lib/definitions';
import Head from 'next/head';
import useCheckSession from '@/src/hooks/useCheckSession';

export const metadata: Metadata = {
  title: 'Dashboard',
};

interface DashboardState {
  items: Item[];
}

interface Action {
  type: 'add' | 'edit' | 'delete' | 'initialize';
  item: Item;
  previousItem?: Item;
}

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const { userName, logout } = useCheckSession();
  const [data, setData] = useState<DashboardState>({ items: [] });
  const [originalItems, setOriginalItems] = useState<Item[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [originalItemTitle, setOriginalItemTitle] = useState<string | null>(
    null,
  );
  const [undoStack, setUndoStack] = useState<Action[]>([]);
  const [redoStack, setRedoStack] = useState<Action[]>([]);
  const { items } = data;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetchApi('GET', `${GET_ITEMS_ROUTE}`);
        if (response.data) {
          setData({ items: response.data.items });
          setOriginalItems(
            response.data.items.map((item: Item) => ({ ...item })),
          );
          setUndoStack([
            {
              type: 'initialize',
              item: { id: 'init', title: '', done: false },
            },
          ]);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const haveItemsChanged = () => {
    return (
      originalItems.length !== items.length ||
      originalItems.some((origItem, index) => {
        const currentItem = items[index];
        return (
          !currentItem ||
          currentItem.id !== origItem.id ||
          currentItem.title !== origItem.title ||
          currentItem.done !== origItem.done
        );
      })
    );
  };

  const handleAddItem = () => {
    const newItem: Item = {
      id: Date.now().toString(),
      title: 'New Item',
      done: false,
    };

    setData((prevData) => ({
      items: [...prevData.items, newItem],
    }));

    setUndoStack((prev) => [...prev, { type: 'add', item: newItem }]);
    setRedoStack([]);
  };

  const handleSaveItem = (id: string, newTitle: string) => {
    const editedItem = items.find((item) => item.id === id);
    if (!editedItem) return;

    const safeOriginalTitle = originalItemTitle || editedItem.title;

    setUndoStack((prev) => [
      ...prev,
      {
        type: 'edit',
        item: editedItem,
        previousItem: { ...editedItem, title: safeOriginalTitle },
      },
    ]);
    setRedoStack([]);

    setEditingItemId(null);
    setOriginalItemTitle(null);
  };

  const handleStartEdit = (id: string) => {
    const currentItem = items.find((item) => item.id === id);
    if (currentItem) {
      setOriginalItemTitle(currentItem.title);
      setEditingItemId(id);
    }
  };

  const handleCancelEdit = () => {
    if (editingItemId !== null && originalItemTitle !== null) {
      const updatedItems = items.map((item) =>
        item.id === editingItemId
          ? { ...item, title: originalItemTitle }
          : item,
      );
      setData({ items: updatedItems });
    }
    setEditingItemId(null);
    setOriginalItemTitle(null);
  };

  const handleItemChange = (id: string, title: string) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, title };
      }
      return item;
    });
    setData({ items: updatedItems });
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find((item) => item.id === id);
    if (!itemToDelete) return;

    setData((prevData) => ({
      items: prevData.items.filter((item) => item.id !== id),
    }));

    setUndoStack((prev) => [...prev, { type: 'delete', item: itemToDelete }]);
    setRedoStack([]);
  };

  const handleToggleDone = (id: string) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, done: !item.done };
        setUndoStack((prev) => [
          ...prev,
          { type: 'edit', item: updatedItem, previousItem: item },
        ]);
        setRedoStack([]);
        return updatedItem;
      }
      return item;
    });

    setData({ items: updatedItems });
  };

  const handleUndo = () => {
    const lastAction = undoStack.pop();
    if (!lastAction) return;

    setRedoStack((prev) => [...prev, lastAction]);

    switch (lastAction.type) {
      case 'add':
        setData((prev) => ({
          items: prev.items.filter((item) => item.id !== lastAction.item.id),
        }));
        break;
      case 'edit':
        setData((prev) => ({
          items: prev.items.map((item) =>
            item.id === lastAction.item.id
              ? (lastAction.previousItem as Item)
              : item,
          ),
        }));
        break;
      case 'delete':
        setData((prev) => ({
          items: [...prev.items, lastAction.item],
        }));
        break;
    }

    setUndoStack((prev) => [...prev]);
  };

  const handleRedo = () => {
    const lastAction = redoStack.pop();
    if (!lastAction) return;

    setUndoStack((prev) => [...prev, lastAction]);

    switch (lastAction.type) {
      case 'add':
        setData((prev) => ({
          items: [...prev.items, lastAction.item],
        }));
        break;
      case 'edit':
        setData((prev) => ({
          items: prev.items.map((item) =>
            item.id === lastAction.item.id ? lastAction.item : item,
          ),
        }));
        break;
      case 'delete':
        setData((prev) => ({
          items: prev.items.filter((item) => item.id !== lastAction.item.id),
        }));
        break;
    }

    setRedoStack((prev) => [...prev]);
  };

  const handleSaveChanges = async () => {
    const addedItems = items.filter(
      (item) => !item.id || !originalItems.some((oi) => oi.id === item.id),
    );
    const updatedItems = items.filter(
      (item) =>
        item.id &&
        originalItems.some((oi) => oi.id === item.id) &&
        !originalItems.find(
          (oi) =>
            oi.id === item.id &&
            oi.title === item.title &&
            oi.done === item.done,
        ),
    );
    const deletedItems = originalItems.filter(
      (oi) => !items.some((item) => item.id === oi.id),
    );

    console.log(addedItems, 'Added Items');
    console.log(updatedItems, 'Updated Items');
    console.log(deletedItems, 'Deleted Items');

    try {
      const results = await Promise.all([
        ...addedItems.map((item) =>
          fetchApi('POST', `${ADD_ITEMS_ROUTE}`, item),
        ),
        ...updatedItems.map((item) =>
          fetchApi('PUT', `${UPDATE_ITEMS_ROUTE}`, {
            id: item.id,
            title: item.title,
            done: item.done,
          }),
        ),
        ...deletedItems.map((item) =>
          fetchApi('DELETE', `${DELETE_ITEMS_ROUTE}`, { id: item.id }),
        ),
      ]);

      // Check if all responses were successful
      const allSuccessful = results.every((res) => res.success === true);

      if (allSuccessful) {
        // Re-fetch items
        const refreshedItems = await fetchApi('GET', GET_ITEMS_ROUTE);
        setData({ items: refreshedItems.data.items });
        // Update originalItems to new state
        setOriginalItems(JSON.parse(JSON.stringify(refreshedItems.data.items)));
        // Reset stacks
        setUndoStack([]);
        setRedoStack([]);
        alert('Changes saved successfully!');
      } else {
        alert('Failed to save some changes.');
      }
    } catch (error) {
      console.error('Failed to save changes:', error);
      alert('Failed to save changes.');
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard | Deas Group</title>
      </Head>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav logout={logout} />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            User: <strong className="pl-2 text-red-500">{userName}</strong>
          </h1>

          <div className="p-5">
            <div className="flex flex-row items-center justify-between py-4 xs:flex xs:flex-col xs:items-center">
              <Button
                className="ml-2 bg-red-500 text-sm text-gray-500 xs:mb-4"
                onClick={handleAddItem}
              >
                Add Item
                <PlusIcon className="h-5 w-5 text-yellow-200" />
              </Button>
              <div className="flex">
                <Button
                  className={clsx('ml-2 text-sm text-white', {
                    'bg-gray-400 hover:bg-gray-400': undoStack.length <= 1,
                    'bg-green-500': undoStack.length > 1,
                  })}
                  onClick={handleUndo}
                  disabled={undoStack.length <= 1}
                >
                  <ArrowLeftCircleIcon className="h-5 w-5" />
                  Undo
                </Button>
                <Button
                  className={clsx('ml-2 text-sm text-white', {
                    'bg-gray-400 hover:bg-gray-400': redoStack.length <= 0,
                    'bg-orange-500': redoStack.length > 0,
                  })}
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                >
                  Redo <ArrowRightCircleIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
            {loading || data.items.length === 0 ? (
              <ToDoListSkeleton items={items} loading={loading} />
            ) : (
              <TodoTable
                items={data.items}
                onDeleteItem={handleDeleteItem}
                onEditItem={handleStartEdit}
                onSaveItem={handleSaveItem}
                onItemChange={handleItemChange}
                onCancelEdit={handleCancelEdit}
                onToggleDone={handleToggleDone}
                editingItemId={editingItemId}
              />
            )}
            <div className="flex items-center pb-2 pt-6">
              <Button
                className={clsx('ml-2 text-sm text-white', {
                  'bg-gray-400 hover:bg-gray-400': !haveItemsChanged(),
                  'bg-red-500': haveItemsChanged(),
                })}
                onClick={handleSaveChanges}
                disabled={!haveItemsChanged()}
              >
                Save Changes
                <BookmarkIcon className="text-white-200 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
