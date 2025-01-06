import { CSS } from '@dnd-kit/utilities';
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import Item from "./Item";

function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="item" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

class MyPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown',
      handler: ({nativeEvent: event}) => {
        if (
          !event.isPrimary ||
          event.button !== 0 ||
          isInteractiveElement(event.target)
        ) {
          return false;
        }

        return true;
      },
    },
  ];
}

function isInteractiveElement(element) {
  const interactiveElements = [
    'button',
    'input',
    'textarea',
    'select',
    'option',
  ];

  if (interactiveElements.includes(element.tagName.toLowerCase())) {
    return true;
  }

  return false;
}

function ItemContainer({ handleAdd, handleDelete, handleChange, items, setItems }) {
  const sensors = useSensors(
    useSensor(MyPointerSensor),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => `${item.index}` === active.id);
      const newIndex = items.findIndex((item) => `${item.index}` === over.id);

      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => `${item.index}`)} strategy={verticalListSortingStrategy}>
        <div className="item_container">
          {items.map((item) => (
            <SortableItem key={item.index} id={`${item.index}`}>
              <Item
                item={item}
                key={item.index}
                index={item.index}
                handleDelete={handleDelete}
                handleChange={handleChange}/>
            </SortableItem>
          ))}
          <button className="add_button" onClick={handleAdd}>
            Add item
          </button>
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default ItemContainer;