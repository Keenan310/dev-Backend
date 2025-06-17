import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
export declare class RouteService {
    create(createRouteDto: CreateRouteDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateRouteDto: UpdateRouteDto): string;
    remove(id: number): string;
}
