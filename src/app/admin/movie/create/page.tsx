'use client';
import React from 'react';
import MovieForm from '../components/form/MovieForm';

export default function Page() {
    return (
        <div className="p-8 pt-2">
            <h2 className="text-xl font-semibold text-slate-700 border-b pb-2 mb-2">Create New Movie</h2>
            <MovieForm />
        </div>
    );
}
