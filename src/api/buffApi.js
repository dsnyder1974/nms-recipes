// This file contains functions to interact with the buff API.

export const fetchBuffs = async () => {
  const response = await fetch(
    'https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgBuffs'
  );
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
};

export async function patchBuff(updatedBuff) {
  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgBuff/${updatedBuff.buff_id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: updatedBuff.name,
        description: updatedBuff.description ?? null,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update buff');
  }

  return await response.json();
}

export async function postBuff(updates) {
  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgBuff`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to post new buff ${updates.name}`);
  }

  return await response.json();
}

export async function deleteBuff(buff_id) {
  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgBuff/${buff_id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to patch buff ${buff_id}`);
  }

  return await response.json();
}
