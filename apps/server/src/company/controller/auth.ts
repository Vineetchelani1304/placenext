import company from "../models/company";
import { Request, Response } from "express";
import Job from "../models/job";
import { google } from "googleapis";
import College from "../../college/models/college";

export const isFirstSignIn = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const existingCompany = await company.findOne({ googleId: user.uid });
    return res
      .status(200)
      .json({ success: true, isFirstSignIn: !existingCompany });
  } catch (error: any) {
    console.log("Error in isFirstSignIn", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    console.log("Error in signup", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const applicationFrom = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    //   _id?: string;
    // comp_name: string;
    // comp_start_date: Date;
    // comp_contact_person: string;
    // comp_email: string;
    // comp_industry: string;
    // com_positions_offered: string[];
    // comp_address: string;
    // comp_jobs_offered: string[];
    // comp_no_employs: number;
    // comp_website: string;
    // comp_location: string;
    // comp_contact_no: string;
    // comp_departments: string[];
    // comp_no_of_stud: number;
    // comp_courses_offered: string[];
    const {
      comp_name,
      comp_start_date,
      comp_contact_person,
      comp_email,
      comp_industry,
      com_positions_offered,
      comp_address,
      comp_jobs_offered,
      comp_no_employs,
      comp_website,
      comp_location,
      comp_contact_no,
      comp_departments,
      comp_no_of_stud,
      comp_courses_offered,
    } = req.body;
    if (
      [
        comp_name,
        comp_start_date,
        comp_contact_person,
        comp_email,
        comp_industry,
        com_positions_offered,
        comp_address,
        comp_jobs_offered,
        comp_no_employs,
        comp_website,
        comp_location,
        comp_contact_no,
        comp_departments,
        comp_no_of_stud,
        comp_courses_offered,
      ].some((field) => field === "")
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const existingCompany = await company.findOne({ comp_email });
    if (existingCompany) {
      return res
        .status(400)
        .json({ success: false, msg: "Company already exists" });
    }
    const newCompany = new company({
      comp_name,
      comp_start_date,
      comp_contact_person,
      comp_email,
      comp_industry,
      com_positions_offered,
      comp_address,
      comp_jobs_offered,
      comp_no_employs,
      comp_website,
      comp_location,
      comp_contact_no,
      comp_departments,
      comp_no_of_stud,
      comp_courses_offered,
    });
    await newCompany.save();
    return res.status(200).json({ success: true, msg: "Company created" });
  } catch (error: any) {
    console.log("Error in applicationFrom", error.message, error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getCompany = async (req: Request, res: Response) => {
  try {
    const companies = await company.find();
    return res.status(200).json({ success: true, companies });
  } catch (error: any) {
    console.log("Error in getCompany", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyDetails = await company.findById(id);
    return res.status(200).json({ success: true, companyDetails });
  } catch (error: any) {
    console.log("Error in getCompanyById", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [
      comp_name,
      comp_start_date,
      comp_contact_person,
      comp_email,
      comp_industry,
      com_positions_offered,
      comp_address,
      comp_jobs_offered,
      comp_no_employs,
      comp_website,
      comp_location,
      comp_contact_no,
      comp_departments,
      comp_no_of_stud,
      comp_courses_offered,
    ] = req.body;
    if (
      [
        comp_name,
        comp_start_date,
        comp_contact_person,
        comp_email,
        comp_industry,
        com_positions_offered,
        comp_address,
        comp_jobs_offered,
        comp_no_employs,
        comp_website,
        comp_location,
        comp_contact_no,
        comp_departments,
        comp_no_of_stud,
        comp_courses_offered,
      ].some((field) => field === "")
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const companyDetails = await company.findById(id);
    if (!companyDetails) {
      return res.status(400).json({ msg: "Company not found" });
    }
    await company.findByIdAndUpdate(id, {
      comp_name,
      comp_start_date,
      comp_contact_person,
      comp_email,
      comp_industry,
      com_positions_offered,
      comp_address,
      comp_jobs_offered,
      comp_no_employs,
      comp_website,
      comp_location,
      comp_contact_no,
      comp_departments,
      comp_no_of_stud,
      comp_courses_offered,
    });
    return res.status(200).json({ success: true, msg: "Company updated" });
  } catch (error: any) {
    console.log("Error in updateCompany", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyDetails = await company.findById(id);
    if (!companyDetails) {
      return res.status(400).json({ msg: "Company not found" });
    }
    await company.findByIdAndDelete(id);
    return res.status(200).json({ success: true, msg: "Company deleted" });
  } catch (error: any) {
    console.log("Error in deleteCompany", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const createJobByCompany = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const LogincollegeUser = req.user;
    const {
      job_title,
      job_type,
      job_location,
      job_salary,
      job_description,
      job_requirements,
      job_posted_date,
      yr_of_exp_req,
      job_timing,
      status,
      company_name,
    } = req.body;

    console.log(req.body); // Debugging output

    // Check for required fields, including company_name
    if (
      [
        job_title,
        job_type,
        job_location,
        job_salary,
        job_description,
        job_requirements,
        job_posted_date,
        yr_of_exp_req,
        job_timing,
        status,
        company_name, // Ensure company_name is checked
      ].some((field) => field === "" || field === undefined) // Check for empty or undefined fields
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check for existing job
    const existingJob = await Job.findOne({ job_title, job_location });

    if (existingJob) {
      return res.status(400).json({ msg: "Job already exists" });
    }

    // Find the college based on the logged-in user
    const foundCollege = await College.findOne({
      googleId: LogincollegeUser.uid,
    });

    if (!foundCollege) {
      return res.status(400).json({ msg: "College not found" });
    }

    // Create new job
    const newJob = new Job({
      job_title,
      job_type,
      job_location,
      company_name,
      job_salary,
      job_description,
      job_requirements,
      job_posted_date,
      yr_of_exp_req,
      job_timing,
      status,
      college: foundCollege._id, // Link to college
    });

    await newJob.save();
    return res.status(200).json({ success: true, msg: "Job created" });
  } catch (error: any) {
    console.log("Error in createJobByCompany", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};


export const getJobsByCompany = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    const jobs = await Job.find({ company: user.uid });
    return res.status(200).json({ success: true, jobs });
  } catch (error: any) {
    console.log("Error in getJobsByCompany", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};  
