import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Send,
  FileText,
  Share2,
  AlertCircle,
  Building2,
  MessageSquare,
  ListTodo,
  ExternalLink,
} from 'lucide-react';
import { db } from '../services/db';
import { CoordinationRoom, CoordinationTask, CoordinationNote, Complaint } from '../types';
import { WindowPanel } from '../components/common/WindowPanel';
import { BureauBadge, StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';

interface CoordinationRoomsPageProps {
  onOpenCase: (caseNumber: string) => void;
  selectedRoomId?: string;
}

export const CoordinationRoomsPage: React.FC<CoordinationRoomsPageProps> = ({
  onOpenCase,
  selectedRoomId,
}) => {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState<CoordinationRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string>(selectedRoomId || '');
  const [tasks, setTasks] = useState<CoordinationTask[]>([]);
  const [notes, setNotes] = useState<CoordinationNote[]>([]);

  // Task creation state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskBureau, setTaskBureau] = useState('PGRC');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Note creation state
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    const loadedRooms = db.getRooms();
    setRooms(loadedRooms);

    if (loadedRooms.length > 0 && !activeRoomId) {
      setActiveRoomId(loadedRooms[0].id);
    }

    const unsub = db.subscribe((state) => {
      setRooms(state.rooms);
    });
    return unsub;
  }, [activeRoomId]);

  useEffect(() => {
    if (activeRoomId) {
      setTasks(db.getTasks(activeRoomId));
      setNotes(db.getNotes(activeRoomId));
    }
  }, [activeRoomId]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !activeRoom) return;

    db.createTask(
      {
        roomId: activeRoom.id,
        title: taskTitle,
        assigneeName: taskAssignee || currentUser?.name || 'Officer',
        bureauCode: taskBureau,
        dueDate: taskDueDate || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
        status: 'Pending',
        priority: 'High',
      },
      currentUser?.name || 'Officer'
    );

    setTasks(db.getTasks(activeRoom.id));
    setTaskTitle('');
    setShowTaskForm(false);
  };

  const handleToggleTaskStatus = (taskId: string, currentStatus: CoordinationTask['status']) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    db.updateTaskStatus(taskId, nextStatus, currentUser?.name || 'Officer');
    if (activeRoom) {
      setTasks(db.getTasks(activeRoom.id));
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim() || !activeRoom) return;

    db.addNote({
      roomId: activeRoom.id,
      authorName: currentUser?.name || 'Officer',
      authorRole: currentUser?.designation || 'Bureau Officer',
      bureauCode: currentUser?.bureauCode || 'PGRC',
      content: noteContent,
    });

    setNotes(db.getNotes(activeRoom.id));
    setNoteContent('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3E3E6]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1F24]">
              Cross-Bureau Coordination Rooms
            </h1>
            <span className="px-2 py-0.5 bg-[#4F8A6B]/15 text-[#4F8A6B] text-xs font-bold rounded">
              Active Sync
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Synchronized workspace for cases under joint review across PGRC, Regulation Bureau, and Regional Offices.
          </p>
        </div>
      </div>

      {/* Main Layout: Master-Detail Windows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Rooms List (Col 4) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
            Active Coordination Rooms ({rooms.length})
          </div>

          <div className="space-y-2">
            {rooms.map((room) => {
              const isSelected = room.id === activeRoom?.id;
              return (
                <div
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className={`p-3.5 rounded-[4px] border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#C9AE7C] shadow-md ring-1 ring-[#C9AE7C]/30'
                      : 'bg-white border-[#E3E3E6] hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-[#1F1F24]">{room.roomNumber}</span>
                    <span className="px-2 py-0.2 bg-[#4F8A6B]/15 text-[#4F8A6B] text-[10px] font-bold rounded">
                      {room.status}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-xs text-[#1F1F24] line-clamp-1">
                    {room.title}
                  </h4>
                  <div className="text-[11px] text-gray-500 mt-1 truncate">
                    Target: {room.institutionName}
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#E3E3E6] flex items-center justify-between text-[10px] text-gray-500">
                    <span>Partners: {room.partnerBureaus.join(', ')}</span>
                    <span className="font-mono font-semibold">{room.caseNumbers.join(' + ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Room Workspace (Col 8) */}
        {activeRoom ? (
          <div className="lg:col-span-8 space-y-4">
            {/* Room Header Card */}
            <div className="bg-white border border-[#E3E3E6] rounded-[4px] p-4 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E3E3E6]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-[#1F1F24]">
                      {activeRoom.roomNumber}
                    </span>
                    <span className="px-2 py-0.5 bg-[#4F8A6B]/15 text-[#4F8A6B] text-xs font-bold rounded">
                      {activeRoom.status}
                    </span>
                  </div>
                  <h2 className="font-serif font-bold text-lg text-[#1F1F24] mt-0.5">
                    {activeRoom.title}
                  </h2>
                </div>
              </div>

              {/* Linked Case Cards */}
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-2">
                  Synchronized Case Dockets Under Joint Scrutiny:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeRoom.caseNumbers.map((caseNum) => {
                    const c = db.getComplaintById(caseNum);
                    return (
                      <div
                        key={caseNum}
                        className="p-3 bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[#1F1F24]">{caseNum}</span>
                          {c && <BureauBadge bureauCode={c.bureauCode} />}
                        </div>
                        <div className="font-medium text-[#1F1F24] truncate">
                          {c?.title || 'Case docket'}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate">
                          Officer: {c?.assignedOfficerName}
                        </div>
                        <button
                          type="button"
                          onClick={() => onOpenCase(caseNum)}
                          className="text-[11px] text-[#655A86] hover:underline flex items-center gap-1 font-semibold pt-1"
                        >
                          <span>Open Case File</span> <ExternalLink size={11} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Joint Action Tasks */}
            <WindowPanel
              title="Synchronized Coordination Tasks"
              subtitle="Assigned deliverables across participating bureau officers"
              icon={<ListTodo size={15} />}
              actions={
                <button
                  type="button"
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="px-2.5 py-1 bg-[#1F1F24] text-[#C9AE7C] text-[11px] font-semibold rounded uppercase tracking-wider flex items-center gap-1"
                >
                  <Plus size={12} />
                  <span>Add Task</span>
                </button>
              }
            >
              <div className="space-y-3">
                {showTaskForm && (
                  <form
                    onSubmit={handleCreateTask}
                    className="p-3 bg-[#FAF6EE] border border-[#C9AE7C] rounded-[2px] space-y-2 text-xs"
                  >
                    <div className="font-bold text-xs text-[#8C6D2E]">New Joint Coordination Task</div>
                    <input
                      type="text"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="Task deliverable title..."
                      required
                      className="w-full bg-white border border-[#E3E3E6] rounded p-1.5 text-xs"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={taskAssignee}
                        onChange={(e) => setTaskAssignee(e.target.value)}
                        placeholder="Assignee Name"
                        className="bg-white border border-[#E3E3E6] rounded p-1.5 text-xs"
                      />
                      <select
                        value={taskBureau}
                        onChange={(e) => setTaskBureau(e.target.value)}
                        className="bg-white border border-[#E3E3E6] rounded p-1.5 text-xs"
                      >
                        <option value="PGRC">PGRC</option>
                        <option value="RB">Regulation Bureau</option>
                        <option value="RO">Regional Office</option>
                        <option value="AB">Approval Bureau</option>
                      </select>
                      <input
                        type="date"
                        value={taskDueDate}
                        onChange={(e) => setTaskDueDate(e.target.value)}
                        className="bg-white border border-[#E3E3E6] rounded p-1 text-xs"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowTaskForm(false)}
                        className="px-2.5 py-1 text-xs border rounded bg-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[#C9AE7C] text-[#1F1F24] font-bold text-xs uppercase rounded"
                      >
                        Create Task
                      </button>
                    </div>
                  </form>
                )}

                {tasks.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500">
                    No active tasks assigned to this room yet.
                  </div>
                ) : (
                  <div className="divide-y divide-[#E3E3E6]">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="py-2.5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <input
                            type="checkbox"
                            checked={task.status === 'Completed'}
                            onChange={() => handleToggleTaskStatus(task.id, task.status)}
                            className="rounded text-[#4F8A6B] focus:ring-0 cursor-pointer"
                          />
                          <div className="truncate">
                            <span
                              className={`font-medium ${
                                task.status === 'Completed'
                                  ? 'line-through text-gray-400'
                                  : 'text-[#1F1F24]'
                              }`}
                            >
                              {task.title}
                            </span>
                            <div className="text-[10px] text-gray-500 font-mono">
                              Assignee: {task.assigneeName} ({task.bureauCode}) · Due: {task.dueDate}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                            task.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </WindowPanel>

            {/* Threaded Internal Notes */}
            <WindowPanel
              title="Official Internal Inquiry Notes"
              subtitle="Confidential joint record for authorized bureau officers"
              icon={<MessageSquare size={15} />}
            >
              <div className="space-y-3">
                <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                  {notes.length === 0 ? (
                    <div className="text-center py-4 text-xs text-gray-400">
                      No internal notes recorded. Post below to communicate across bureaus.
                    </div>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 font-semibold text-[#1F1F24]">
                            <span>{note.authorName}</span>
                            <BureauBadge bureauCode={note.bureauCode} />
                            <span className="text-gray-400 font-normal">({note.authorRole})</span>
                          </div>
                          <span className="text-[10px] font-mono text-gray-400">
                            {new Date(note.timestamp).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-gray-700 text-xs leading-relaxed">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex gap-2 pt-2 border-t border-[#E3E3E6]">
                  <input
                    type="text"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Enter official inquiry remark or cross-bureau update..."
                    className="flex-1 bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] px-3 py-1.5 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C]"
                  />
                  <button
                    type="submit"
                    disabled={!noteContent.trim()}
                    className="px-4 py-1.5 bg-[#1F1F24] text-[#C9AE7C] text-xs font-bold uppercase rounded-[2px] hover:bg-black transition-colors disabled:opacity-40"
                  >
                    Post Note
                  </button>
                </form>
              </div>
            </WindowPanel>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-xs text-gray-500 bg-white border border-[#E3E3E6] rounded">
            Select a Coordination Room on the left to inspect joint deliverables.
          </div>
        )}
      </div>
    </div>
  );
};
