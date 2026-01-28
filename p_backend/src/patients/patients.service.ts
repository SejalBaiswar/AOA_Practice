import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
  import { Address } from '../addresses/entities/address.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  // ================= CREATE PATIENT =================
  async create(createPatientDto: CreatePatientDto): Promise<any> {
    // 🔹 Check duplicate email
    const existingPatient = await this.patientRepository.findOne({
      where: { email: createPatientDto.email },
    });

    if (existingPatient) {
      throw new ConflictException(
        `Patient with email ${createPatientDto.email} already exists`,
      );
    }

    const { address, ...patientData } = createPatientDto;

    // 🔹 Save patient FIRST
    const patient = this.patientRepository.create({
      ...patientData,
      dob: new Date(createPatientDto.dob),
    });

    const savedPatient = await this.patientRepository.save(patient);

    // 🔹 Try saving address (DO NOT FAIL PATIENT)
    let addresses: Address[] = [];

    if (address) {
      try {
        await this.addressRepository.save(
          this.addressRepository.create({
            house_no: address.house_no ?? null,
            street: address.street ?? null,
            city: address.city,
            state: address.state,
            country: address.country,
            zipCode: address.zipCode,
            address_type: address.address_type ?? null,
            userId: savedPatient.id,
            entityType: 'patient',
          }),
        );
      } catch (addressError) {
        // IMPORTANT: log only, do NOT throw
        console.error('ADDRESS SAVE FAILED:', addressError);
      }

      // Fetch saved address (if any)
      addresses = await this.addressRepository.find({
        where: {
          userId: savedPatient.id,
          entityType: 'patient',
        },
      });
    }

    // ✅ ALWAYS RETURN SUCCESS
    return {
      ...savedPatient,
      addresses,
    };
  }

  // ================= FIND ALL =================
  async findAll(): Promise<any[]> {
    const patients = await this.patientRepository.find({
      order: { createdAt: 'DESC' },
    });

    return Promise.all(
      patients.map(async (patient) => {
        const addresses = await this.addressRepository.find({
          where: {
            userId: patient.id,
            entityType: 'patient',
          },
        });

        return {
          ...patient,
          addresses,
        };
      }),
    );
  }

  // ================= FIND ONE =================
  async findOne(id: string): Promise<any> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    const addresses = await this.addressRepository.find({
      where: {
        userId: patient.id,
        entityType: 'patient',
      },
    });

    return {
      ...patient,
      addresses,
    };
  }

  // ================= UPDATE =================
  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<any> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    if (
      updatePatientDto.email &&
      updatePatientDto.email !== patient.email
    ) {
      const existingPatient = await this.patientRepository.findOne({
        where: { email: updatePatientDto.email },
      });

      if (existingPatient) {
        throw new ConflictException(
          `Patient with email ${updatePatientDto.email} already exists`,
        );
      }
    }

    if (updatePatientDto.dob) {
      (updatePatientDto as any).dob = new Date(updatePatientDto.dob);
    }

    Object.assign(patient, updatePatientDto);
    const updatedPatient = await this.patientRepository.save(patient);

    const addresses = await this.addressRepository.find({
      where: {
        userId: updatedPatient.id,
        entityType: 'patient',
      },
    });

    return {
      ...updatedPatient,
      addresses,
    };
  }

  // ================= DELETE =================
  async remove(id: string): Promise<void> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    await this.patientRepository.remove(patient);
  }
}
