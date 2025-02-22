"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  PlusIcon,
  EllipsisVerticalIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Board } from "@/lib/boardManager";
import { TodoCompo } from "./TodoCompo";
import { Todo } from "@/lib/todoManager";

interface BoardProps extends React.ComponentProps<"div"> {
  board: Board;
  setBoard: (board: Board) => void;
  createTodo: () => void;
  editBoardName: (name: string) => void;
  deleteBoard: () => void;
  changeTodoName: (todoId: string, name: string) => void;
  deleteTodo: (todoId: string) => void;
}

export function BoardCompo({
  board,
  setBoard,
  createTodo,
  editBoardName,
  deleteBoard,
  changeTodoName,
  deleteTodo,
  ...props
}: BoardProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [draggingTodo, setDraggingTodo] = useState<Todo | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleDragStart = (todo: Todo) => {
    setDraggingTodo(todo);
  };

  const handleDragOver = (index: number) => {
    setHoverIndex(index);
  };

  const handleDragEnd = () => {
    resetDragging();
  };

  const handleDrop = () => {
    if (draggingTodo !== null && hoverIndex !== null) {
      const updatedTodos = [...board.todos];
      const oldIndex = updatedTodos.findIndex((t) => t.id === draggingTodo.id);
      updatedTodos.splice(oldIndex, 1);

      let newIndex = hoverIndex;
      if (hoverIndex <= 0) {
        newIndex = 0;
      } else if (hoverIndex >= board.todos.length) {
        newIndex = board.todos.length;
      }

      updatedTodos.splice(newIndex, 0, draggingTodo);
      setBoard({ ...board, todos: updatedTodos });
    }
    resetDragging();
  };

  const resetDragging = () => {
    setDraggingTodo(null);
    setHoverIndex(null);
  };

  const onClickEdit = () => {
    nameInputRef.current?.focus();
  };

  return (
    <Card className="w-[20vw] h-[70vh]" {...props}>
      <CardHeader
        className="grid grid-cols-[50%_auto_.25fr_.25fr] items-center"
        onDragOver={(e) => {
          e.preventDefault();
          setHoverIndex(-1);
        }}
        onDrop={handleDrop}
      >
        <CardTitle className="mr-4">
          <Input
            className="text-ellipsis text-xl md:text-lg"
            ref={nameInputRef}
            value={board.name}
            onChange={(e) => editBoardName(e.target.value)}
          />
        </CardTitle>
        <span>{board.todos.length}</span>
        <Button variant={"icon"} className="w-fit" onClick={createTodo}>
          <PlusIcon />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"icon"} className="w-fit">
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-24">
            <DropdownMenuItem onClick={createTodo}>
              <PlusIcon />
              <span>할 일 추가</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onClickEdit}>
              <EditIcon />
              <span>이름 수정</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-700 focus:text-red-700"
              onClick={deleteBoard}
            >
              <TrashIcon />
              <span>보드 삭제</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent
        className="flex flex-col gap-2 flex-1 overflow-y-auto"
        onDrop={handleDrop}
      >
        {board.todos.map((t, index) => (
          <div
            key={t.id}
            className={`relative  rounded-lg `}
            draggable
            onDragStart={() => handleDragStart(t)}
            onDragOver={(e) => {
              e.preventDefault();
              handleDragOver(index);
            }}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          >
            <div
              className={`w-full h-[4px] bg-blue-500 ${
                index === 0 && hoverIndex === -1 ? "visible" : "invisible"
              }`}
            ></div>

            <TodoCompo
              className={`${draggingTodo?.id === t.id ? "opacity-50" : ""}`}
              todo={t}
              changeTodoName={changeTodoName}
              deleteTodo={deleteTodo}
            />
            {hoverIndex === index && (
              <div className="absolute bottom-[-4px] left-0 w-full h-[4px] bg-blue-500"></div>
            )}
            <div
              className={`w-full h-[4px] bg-blue-500 ${
                index === board.todos.length - 1 &&
                hoverIndex === board.todos.length
                  ? "visible"
                  : "invisible"
              }`}
            ></div>
          </div>
        ))}
        <div
          className="flex-1"
          onDragOver={(e) => {
            e.preventDefault();
            setHoverIndex(board.todos.length);
          }}
          onDrop={handleDrop}
        ></div>
      </CardContent>
    </Card>
  );
}
