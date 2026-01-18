import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Example: Get all records from a table
export async function GET(request: NextRequest) {
  try {
    // Example query - replace 'your_table' with your actual table name
    const result = await query('SELECT * FROM your_table LIMIT 10');
    
    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rowCount,
    });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch data',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Example: Create a new record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Example insert query - modify according to your table structure
    const result = await query(
      'INSERT INTO your_table (column1, column2) VALUES ($1, $2) RETURNING *',
      [body.column1, body.column2]
    );
    
    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Record created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Database insert error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create record',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

