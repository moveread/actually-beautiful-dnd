import React, { useMemo, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import * as R from "ramda";
import { Config, Hook, Item } from ".";
import styled from "styled-components";

const Card = styled.div`
  & > * {
    display: inline-block;
  }
`

/** #### DOESN'T WORK WITH <React.StrictMode> */
export function useReorder(items: Item[], config?: Config): Hook {

  const startOrder = useMemo(() => R.range(0, items.length), [items.length])
  const [order, setOrder] = useState(startOrder);
  const dirty = !R.equals(order, startOrder)

  const onDragEnd = (result: DropResult) => {
    if (result.destination?.index === undefined) {
      return;
    }
    const newItems = Array.from(order);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setOrder(newItems);
  };

  const ordered = order.map((i) => items[i]);

  const reorderer = (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {ordered.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={config?.disabled}>
                {(provided) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {item.elem(index)}
                  </Card>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  return { reorderer, order, ordered, dirty };
}
