import { Position } from "@/types";
import axios from "axios";

export async function getPositions(): Promise<Position[]> {
    const result = await axios.get('http://localhost:3000/')
    return result.data
}

export async function addPosition() {
    await axios.post('http://localhost:3000/')
}

export async function editPosition(id: string, position: any) {
    await axios.put(`http://localhost:3000/${id}`, position)
}

export async function deletePosition(id: string) {
    await axios.delete(`http://localhost:3000/${id}`)
}