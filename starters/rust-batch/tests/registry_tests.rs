//! Registry Integration Tests
//!
//! Tests for job registry (happy path only).

use batch::application::jobs::hello_world_job;
use batch::registry::{clear_registry, get_all_jobs, get_job, has_job, register_job, registry_size};

fn setup() {
    clear_registry();
}

#[test]
fn test_register_and_get_job() {
    setup();

    let job = hello_world_job();
    let job_name = job.name.clone();

    register_job(job);

    let retrieved = get_job(&job_name);
    assert!(retrieved.is_some());
    assert_eq!(retrieved.unwrap().name, job_name);
}

#[test]
fn test_has_job() {
    setup();

    let job = hello_world_job();
    let job_name = job.name.clone();

    register_job(job);

    assert!(has_job(&job_name));
    assert!(!has_job("non-existent-job"));
}

#[test]
fn test_get_all_jobs() {
    setup();

    register_job(hello_world_job());

    let jobs = get_all_jobs();
    assert_eq!(jobs.len(), 1);
    assert_eq!(jobs[0].name, "hello-world");
}

#[test]
fn test_registry_size() {
    setup();

    assert_eq!(registry_size(), 0);

    register_job(hello_world_job());

    assert_eq!(registry_size(), 1);
}

#[test]
fn test_clear_registry() {
    setup();

    register_job(hello_world_job());
    assert_eq!(registry_size(), 1);

    clear_registry();
    assert_eq!(registry_size(), 0);
}
