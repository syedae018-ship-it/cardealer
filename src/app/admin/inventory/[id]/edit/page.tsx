'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CarForm } from '@/components/CarForm';
import { fetchCarById } from '@/lib/inventoryService';
import { Car } from '@/lib/types';

export default function EditCarPage() {
  const params = useParams();
  const id = params?.id as string;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCar(id);
    }
  }, [id]);

  async function loadCar(carId: string) {
    setLoading(true);
    const data = await fetchCarById(carId);
    setCar(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-bold text-neutral-500">
        Loading vehicle details for editing...
      </div>
    );
  }

  if (!car) {
    return (
      <div className="py-20 text-center text-neutral-500">
        <p className="font-bold text-sm">Car not found</p>
      </div>
    );
  }

  return <CarForm initialData={car} isEdit={true} />;
}
