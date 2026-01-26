//jwt stratgy for auth requests using

import { UnauthorizedException } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { PassportStrategy } from "@nestjs/passport/dist/passport/passport.strategy";
import { Strategy,ExtractJwt } from "passport-jwt";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {//extends passport strategy
    constructor(
        
        private configService: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    //validate jwt token
    async validate(payload:{sub:string, email:string}){
        const user=await this.prisma.user.findUnique({
            where:{id:payload.sub},
            select:{
                id:true,
                email:true,
                firstName:true,
                lastName:true,
                role:true,
                createdAt:true,
                updatedAt:true,
                password:false,
            }
        });
        if(!user){
            throw new UnauthorizedException('User not found');
    }
        return user;//attach user to request object
    }

}
