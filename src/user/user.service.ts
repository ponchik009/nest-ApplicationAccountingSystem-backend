import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { WorkgroupService } from 'src/workgroup/workgroup.service';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/changePasswordDto.dto';
import { CreateUserDto } from './dto/createUserDto.dto';
import { PasswordRecoveryDto } from './dto/passwordRecovery.dto';
import { VerifyCodeDto } from './dto/verifyCode.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/updateUserDto.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private workgroupService: WorkgroupService,
    private emailService: EmailService,
  ) {}

  public async getById(id: number): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .select(['user', 'workgroup'])
      .where('user.id = :id', { id })
      .leftJoin('user.workgroup', 'workgroup')
      .leftJoinAndSelect('workgroup.role', 'role')
      .getOne();

    if (!user) {
      throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  public async getByEmail(email: string): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .select(['user', 'workgroup'])
      .where('user.email = :email', { email })
      .leftJoin('user.workgroup', 'workgroup')
      .leftJoinAndSelect('workgroup.role', 'role')
      .getOne();

    if (!user) {
      throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  public async getByTelegram(telegram: string): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .select(['user', 'workgroup'])
      .where('user.telegram = :telegram', { telegram })
      .leftJoin('user.workgroup', 'workgroup')
      .leftJoinAndSelect('workgroup.role', 'role')
      .getOne();

    if (!user) {
      throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  public async getByLogin(login: string): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.password',
        'user.login',
        'user.telegram',
        'workgroup',
      ])
      .where('user.login = :login', { login })
      .leftJoin('user.workgroup', 'workgroup')
      .leftJoinAndSelect('workgroup.role', 'role')
      .getOne();

    if (!user) {
      throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async create(dto: CreateUserDto) {
    const workgroup = await this.workgroupService.getById(dto.workgroup.id);
    workgroup.users = undefined;
    try {
      const user = this.userRepo.create({ ...dto, workgroup });
      return await this.userRepo.save(user);
    } catch (err) {
      throw new HttpException(
        'Пользователь с такими данными уже существует!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async passwordRecovery(dto: PasswordRecoveryDto) {
    /**
     * берем пользователя
     * генерируем код
     * сохраняем в базе
     * отправляем на почту
     */
    const user = await this.getByEmail(dto.email);

    const code = this.generateCode();
    user.verifCode = code;
    await this.userRepo.save(user);

    await this.emailService.sendEMail(
      user.email,
      'Агенты габена',
      `<h1>Здравствуйте</h1><br/><p>Введите этот код: ${code}</p>`,
    );
  }

  public async verifyCode(dto: VerifyCodeDto) {
    const user = await this.getByEmail(dto.email);

    if (user.verifCode !== dto.code) {
      throw new HttpException('Код неверен!', HttpStatus.BAD_REQUEST);
    }
  }

  public async changePassword(dto: ChangePasswordDto) {
    const user = await this.getByEmail(dto.email);

    if (user.verifCode !== dto.code) {
      throw new HttpException('Код неверен!', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    user.password = hashedPassword;
    await this.userRepo.save(user);
  }

  public async update(dto: UpdateUserDto, user: User) {
    const userFromDto = await this.getById(dto.id);

    if (
      userFromDto.id !== user.id &&
      user.workgroup.role.name !== 'Администратор'
    ) {
      throw new HttpException('В доступе отказано', HttpStatus.FORBIDDEN);
    }

    const newUser = this.userRepo.create({ ...dto, id: dto.id });
    return await this.userRepo.save(newUser);
  }

  private generateCode() {
    let s = '';
    for (let i = 0; i < 6; i++) {
      s += Math.floor(Math.random() * 10);
    }
    return s;
  }
}
