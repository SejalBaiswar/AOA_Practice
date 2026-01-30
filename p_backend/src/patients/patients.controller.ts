import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  /* ---------- CREATE PATIENT ---------- */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPatientDto: CreatePatientDto) {
    const patient = await this.patientsService.create(createPatientDto);

    return {
      success: true,
      status: HttpStatus.CREATED,
      message: 'Patient created successfully',
      data: patient,
    };
  }

  /* ---------- GET ALL PATIENTS ---------- */
  @Get()
  async findAll() {
    const patients = await this.patientsService.findAll();

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Patients fetched successfully',
      data: patients,
    };
  }

  /* ---------- GET PATIENT BY ID ---------- */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const patient = await this.patientsService.findOne(id);

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Patient fetched successfully',
      data: patient,
    };
  }

  /* ---------- UPDATE PATIENT ---------- */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    const updatedPatient = await this.patientsService.update(
      id,
      updatePatientDto,
    );

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Patient updated successfully',
      data: updatedPatient,
    };
  }

  /* ---------- DELETE PATIENT ---------- */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.patientsService.remove(id);

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Patient deleted successfully',
      data: null,
    };
  }
}
