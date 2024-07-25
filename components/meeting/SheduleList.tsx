'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ScheduleList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showItems, setShowItems] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [items] = useState([
    { id: 1, label: 'Apple' },
    { id: 2, label: 'Banana' },
    { id: 3, label: 'Cherry' },
    { id: 4, label: 'Date' },
    { id: 5, label: 'Elderberry' },
    { id: 6, label: 'Fig' },
    { id: 7, label: 'Grape' },
    { id: 8, label: 'Honeydew' },
    { id: 9, label: 'Kiwi' },
    { id: 10, label: 'Lemon' },
  ]);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [items, searchTerm]);

  const handleItemSelect = (item) => {
    if (!selectedItems.some((i) => i.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
      setSearchTerm('');
      setShowItems(false);
    }
  };

  const handleItemRemove = (item) => {
    setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
  };

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <div className="flex flex-wrap items-center rounded-md border bg-white p-2">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="bg-primary text-primary-foreground mb-2 mr-2 flex items-center space-x-2 rounded-full px-3 py-1 text-sm"
            >
              <span>{item.label}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleItemRemove(item)}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Input
            type="text"
            placeholder="Search and select connections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowItems(true)}
            onBlur={() => setTimeout(() => setShowItems(false), 200)} // Delay to allow click
            className="min-w-[150px] flex-grow pr-10"
          />
        </div>
        {showItems && filteredItems.length > 0 && (
          <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-md bg-white shadow-lg">
            <ul className="max-h-64 overflow-auto py-1">
              {filteredItems.map((item) => (
                <li
                  key={item.id}
                  className="hover:bg-muted cursor-pointer px-4 py-2"
                  onClick={() => handleItemSelect(item)}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
